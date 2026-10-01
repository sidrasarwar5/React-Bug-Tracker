const cloudinary = require("../config/cloudinary");

const CHUNK_SIZE = 5; // max parallel Cloudinary calls

// https://res.cloudinary.com/demo/image/upload/v1700000000/bug-tracker/bugs/abc123.png
// -> bug-tracker/bugs/abc123
function getPublicId(url) {
  if (!url || typeof url !== "string") return null;
  if (!url.includes("res.cloudinary.com")) return null;

  const cleanUrl = url.split("?")[0];
  const match = cleanUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? decodeURIComponent(match[1]) : null;
}

// Never throws: a Cloudinary problem must not break a DB delete.
async function deleteImage(url) {
  const publicId = getPublicId(url);
  if (!publicId) return;

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    if (result.result !== "ok" && result.result !== "not found") {
      console.error(
        `[cloudinary] unexpected result for "${publicId}":`,
        result,
      );
    }
  } catch (error) {
    console.error(
      `[cloudinary] failed to delete "${publicId}":`,
      error.message,
    );
  }
}

// Deletes many images in small parallel batches (skips empty/duplicate values).
async function deleteImages(urls = []) {
  const unique = [...new Set(urls.filter(Boolean))];

  for (let i = 0; i < unique.length; i += CHUNK_SIZE) {
    await Promise.all(unique.slice(i, i + CHUNK_SIZE).map(deleteImage));
  }
}

module.exports = { getPublicId, deleteImage, deleteImages };
