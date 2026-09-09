import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import Card from "../ui/Card";
import DropdownMenu from "../ui/DropdownMenu";
import ConfirmModal from "../ui/ConfirmModal";

const DEFAULT_ICONS = [
  { src: "/ProjectCard/icon-projCard1.svg", bg: "#67CFCF" },
  { src: "/ProjectCard/icon-projCard2.svg", bg: "#CEF87D" },
  { src: "/ProjectCard/icon-projCard3.svg", bg: "#FFB1BC" },
  { src: "/ProjectCard/icon-projCard4.svg", bg: "#9294E8" },
  { src: "/ProjectCard/icon-projCard5.svg", bg: "#EE9045" },
  { src: "/ProjectCard/icon-projCard6.svg", bg: "#81BCFF" },
];

function getDefaultIcon(projectId) {
  if (!projectId) return DEFAULT_ICONS[0];

  const index =
    projectId.charCodeAt(projectId.length - 1) % DEFAULT_ICONS.length;

  return DEFAULT_ICONS[index];
}

export default function ProjectCard({ project, onDelete, onOpenAssign }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const hasLogo = Boolean(project.logo);
  const defaultIcon = getDefaultIcon(project._id);

  function handleConfirmDelete() {
    onDelete(project._id);
    setIsConfirmOpen(false);
  }

  return (
    <Card bordered={false} className="relative card-shadow">
      {(onOpenAssign || onDelete) && (
        <div className="absolute right-3 top-3 flex items-center gap-1">
          {onOpenAssign && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpenAssign(project);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-primary"
              aria-label="Assign people"
            >
              <UserPlus size={16} />
            </button>
          )}

          {onDelete && (
            <DropdownMenu
              items={[
                {
                  label: "Delete",
                  danger: true,
                  icon: "delete.svg",
                  onClick: () => setIsConfirmOpen(true),
                },
              ]}
            />
          )}
        </div>
      )}

      <Link to={`/projects/${project._id}/bugs`} className="block">
        <span
          className="mb-4 flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg"
          style={{ backgroundColor: hasLogo ? "#F4F4F5" : defaultIcon.bg }}
        >
          {hasLogo ? (
            <img
              src={project.logo}
              alt={project.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={defaultIcon.src}
              alt={project.name}
              className="h-7 w-7 object-contain"
            />
          )}
        </span>
        <h3 className="mb-3 text-body2 project-name">{project.name}</h3>

        {project.description && (
          <p className="mb-2 line-clamp-1 project-desc">
            {project.description}
          </p>
        )}

        {project.taskProgress && (
          <p className="mt-2 text-body-xs">
            <span className="text-[#87888C]">Task Done: </span>
            <span className="text-[#000000] font-medium">
              {project.taskProgress.done}/{project.taskProgress.total}
            </span>
          </p>
        )}
      </Link>

      {onDelete && (
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Project"
          message={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        />
      )}
    </Card>
  );
}
