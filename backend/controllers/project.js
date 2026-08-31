const { SendMail } = require("../utils/mail");
const User = require("../models/user");
const Project = require("../models/project");

async function CreateProject(req, res) {
  try {
    const { name } = req.body;

    const newProject = new Project({
      name,
      creater: req.userId,
    });

    const saved = await newProject.save();
    res.json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function AssignProject(req, res) {
  try {
    const { email, user_type } = req.body;

    const project = await Project.findById(req.params.projectId);
    if (project) {
      const projectInfo = await Project.findById(req.params.projectId);
      const check = project.creater.toString() === req.userId;

      if (check) {
        const manger = await User.findById(req.userId);
        const user = await User.findOne({ email: email });

        if (user) {
          const role = user.user_type === user_type;
          if (role) {
            const existingQa = project.assignedqas.some(
              (id) => id.toString() === user._id.toString(),
            );
            const existingDev = project.assigneddeveloper.some(
              (id) => id.toString() === user._id.toString(),
            );

            const qa = user.user_type === "qa";

            if (qa) {
              if (!existingQa) {
                project.assignedqas.push(user._id);
                await project.save();
                SendMail(user.email, manger.name, projectInfo.name);
                return res.json(project);
              } else {
                return res.status(403).json({ error: "Already" });
              }
            } else {
              if (!existingDev) {
                project.assigneddeveloper.push(user._id);
                await project.save();
                SendMail(user.email, manger.name, projectInfo.name);
                return res.json(project);
              } else {
                return res.status(403).json({ error: "Already" });
              }
            }
          } else {
            return res
              .status(403)
              .json({ error: "The role has not matched to email." });
          }
        } else {
          return res
            .status(403)
            .json({ error: "No such qa or developer found" });
        }
      } else {
        return res.status(400).json({ error: "manger id failed to match" });
      }
    } else {
      return res.status(403).json({ error: "project not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function DeleteProject(req, res) {
  try {
    const project = await Project.findById(req.params.projectId);
    if (project) {
      const check = project.creater.toString() === req.userId;

      if (check) {
        const del = await Project.deleteOne({ _id: req.params.projectId });
        res.json(del);
      } else {
        return res
          .status(403)
          .json({ error: "Project not associated to this manger" });
      }
    } else {
      return res.status(403).json({ error: "Project not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function GetProjects(req, res) {
  try {
    let projects;

    if (req.user_type === "qa") {
      projects = await Project.find({ assignedqas: req.userId })
        .populate("assignedqas", "email name")
        .populate("assigneddeveloper", "email name")
        .populate("creater", "name");
    } else if (req.user_type === "developer") {
      projects = await Project.find({ assigneddeveloper: req.userId })
        .populate("assignedqas", "email name")
        .populate("assigneddeveloper", "email name")
        .populate("creater", "name");
    } else if (req.user_type === "manager") {
      projects = await Project.find({ creater: req.userId })
        .populate("assignedqas", "email name")
        .populate("assigneddeveloper", "email name")
        .populate("creater", "name");
    }

    res.json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
module.exports = { CreateProject, AssignProject, DeleteProject, GetProjects };
