import ProjectCard from "./ProjectCard";

/**
 * ProjectGrid — owns layout and empty/loading states.
 * ProjectCard stays pure presentation; this is where "what if
 * there are 0 projects" logic lives, kept out of the card itself.
 */
export default function ProjectGrid({ projects, loading }) {
  if (loading) {
    return <p className="text-body-small text-gray-500">Loading projects...</p>;
  }

  if (projects.length === 0) {
    return <p className="text-body-small text-gray-500">No projects yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
