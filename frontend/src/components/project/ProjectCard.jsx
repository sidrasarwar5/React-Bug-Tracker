import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Folder,
  Layers,
  Rocket,
  Zap,
  Star,
  Compass,
  UserPlus,
} from "lucide-react";
import Card from "../ui/Card";
import DropdownMenu from "../ui/DropdownMenu";
import ConfirmModal from "../ui/ConfirmModal";

const DEFAULT_ICONS = [Folder, Layers, Rocket, Zap, Star, Compass];

function getDefaultIcon(projectId) {
  if (!projectId) return DEFAULT_ICONS[0];

  const index =
    projectId.charCodeAt(projectId.length - 1) % DEFAULT_ICONS.length;

  return DEFAULT_ICONS[index];
}

export default function ProjectCard({ project, onDelete, onOpenAssign }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const hasLogo = Boolean(project.logo);
  const DefaultIcon = getDefaultIcon(project._id);

  function handleConfirmDelete() {
    onDelete(project._id);
    setIsConfirmOpen(false);
  }

  return (
    <Card className="relative transition-shadow hover:shadow-md">
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
                  onClick: () => setIsConfirmOpen(true),
                },
              ]}
            />
          )}
        </div>
      )}

      <Link to={`/projects/${project._id}/bugs`} className="block">
        <span className="mb-4 flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-primary">
          {hasLogo ? (
            <img
              src={project.logo}
              alt={project.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <DefaultIcon size={20} />
          )}
        </span>

        <h3 className="mb-1 text-body2 font-semibold text-gray-900">
          {project.name}
        </h3>

        {project.description && (
          <p className="mb-2 line-clamp-1 text-body-small text-gray-500">
            {project.description}
          </p>
        )}

        {project.taskProgress && (
          <p className="mt-2 text-body-xs text-gray-400">
            Task Done: {project.taskProgress.done}/{project.taskProgress.total}
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
