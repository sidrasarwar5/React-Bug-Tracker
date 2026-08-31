const { SendMail } = require("../utils/mail");
const User = require("../models/user");
const Project = require("../models/project");
const Bug = require("../models/bug");

async function CreateBug(req, res) {
  try {
    const { title, desc, deadline, type, status, assignToDev } = req.body;
    let img = null;

    if (req.file) {
      img = req.file.filename;
    }

    const project = await Project.findById(req.params.projectId);

    if (project) {
      const check = project.assignedqas.some(
        (id) => id.toString() === req.userId,
      );
      if (check) {
        const user = await User.findOne({ email: assignToDev });

        if (user) {
          const QaInfo = await User.findById(req.userId);
          const devVerify = project.assigneddeveloper.some(
            (id) => id.toString() === user._id.toString(),
          );
          if (devVerify) {
            const newBug = new Bug({
              title,
              desc,
              deadline,
              img,
              type,
              status,
              reporter: req.userId,
              projectRef: project._id,
              assignToDev: user._id,
            });
            const existingTitle = await Bug.findOne({
              title: title,
              projectRef: req.params.projectId,
            });
            if (!existingTitle) {
              const saved = await newBug.save();
              SendMail(user.email, QaInfo.name, project.name);
              res.json(saved);
            } else {
              return res.status(403).json({ error: "title exists" });
            }
          } else {
            return res
              .status(403)
              .json({ error: "this developer not assigned to project" });
          }
        } else {
          return res.status(403).json({ error: "Developer not add" });
        }
      } else {
        return res.status(403).json({ error: "Qa is not assigned" });
      }
    } else {
      return res.status(403).json({ error: "project not found" });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Please fill all required fields",
      });
    }

    return res.status(400).json({
      error: "Failed to create bug",
    });
  }
}

async function UpdateStatus(req, res) {
  try {
    const { status } = req.body;

    const project = await Project.findById(req.params.projectId);

    if (project) {
      const bug = await Bug.findById(req.params.bugId);
      if (bug) {
        const bugVerify = bug.projectRef.toString() === req.params.projectId;
        if (bugVerify) {
          const check = bug.assignToDev.toString() === req.userId;
          if (check) {
            if ((bug.type === "bug" && bug.status === "resolved")) {
              return res
                .status(403)
                .json({
                  error: "This bug was already resolved.",
                });
            }
            if((bug.type === "feature" && bug.status === "completed")){
               return res
                .status(403)
                .json({
                  error: "This feature was already completed.",
                });
            }
            bug.status = status;
            await bug.save();
            return res.json(bug);
          } else {
            return res
              .status(403)
              .json({ error: "no such developer is assigned to bug" });
          }
        } else {
          return res
            .status(403)
            .json({ error: "bug does not belong to this project" });
        }
      } else {
        return res.status(403).json({ error: "no such bug available" });
      }
    } else {
      return res.status(403).json({ error: "no such project found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function BugDetail(req, res) {
  try {
    const bug = await Bug.findById(req.params.bugId).populate('assignToDev', 'name email');
    if (bug) {
      const bugVerify = bug.projectRef.toString() === req.params.projectId;
      if (bugVerify) {
        const timePassed = bug.time_passed();
        const stale = bug.stale();

        res.json({ ...bug.toObject(), time_passed: timePassed, stale: stale });
      } else {
        return res.status(400).json({ error: "bug tot refer to this project" });
      }
    } else {
      return res.status(400).json({ error: "Bug not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function GetProjectBugs(req, res) {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "No such project found" });
    }

    const isManager = project.creater.toString() === req.userId;
    const isQa = project.assignedqas.some((id) => id.toString() === req.userId);
    const isDeveloper = project.assigneddeveloper.some(
      (id) => id.toString() === req.userId,
    );

    if (!isManager && !isQa && !isDeveloper) {
      return res.status(403).json({ error: "Not part of this project" });
    }

    let bugs;

    if (isDeveloper) {
      bugs = await Bug.find({
        projectRef: projectId,
        assignToDev: req.userId,
      });
    } else {
      bugs = await Bug.find({
        projectRef: projectId,
      });
    }

    return res.json(bugs);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = { CreateBug, UpdateStatus, BugDetail, GetProjectBugs };
