import { Link } from "react-router-dom";
import { getProjectVisual, PROJECT_STATUSES } from "../../constants/projectVisuals";


export default function ProjectCard({ project }) {
  const visual = getProjectVisual(project.name);
  const Icon = visual.icon;
  const status = PROJECT_STATUSES[project.status] || PROJECT_STATUSES.active;

  return (
    <Link
      to={`/projects/${project._id}/bugs`}
      className="block rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
    >
      <span
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${visual.bg} ${visual.color}`}
      >
        <Icon size={20} />
      </span>

      <h3 className="mb-1 text-body2 font-semibold text-gray-900">{project.name}</h3>

      {project.description && (
        <p className="mb-2 line-clamp-1 text-body-small text-gray-500">
          {project.description}
        </p>
      )}

      <span className={`inline-flex items-center gap-1.5 text-body-xs font-medium ${status.color}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
        {status.label}
      </span>
    </Link>
  );
}
