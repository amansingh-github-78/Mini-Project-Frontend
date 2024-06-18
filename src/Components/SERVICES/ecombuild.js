import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";

const EcomBuild = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing projects
    fetchProjects();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (projects.length > 0) {
        const confirmationMessage =
          "Are you sure you want to leave customization? Your changes may be lost.";
        e.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [projects]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewProject = async () => {
    const confirmation = window.confirm(
      'Are you sure you want to create a new project? All your previous project\'s data will be lost.'
    );
  
    if (confirmation) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/projects/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: newProject })
        });
  
        const data = await response.json();
        setLoading(false);
        navigate(`/customize/${data._id}`); // Navigate to the customize page with the new project ID
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div>Loading... Please wait while the server is starting.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex flex-col justify-center items-center p-4">
      <h1 className="text-4xl font-bold text-black">E-Commerce Site Builder</h1>
      <div className="h-screen w-full max-w-6xl space-y-6" style={{ maxHeight: "75vh" }}>
        <div className="relative bg-white shadow-lg rounded-lg p-6" style={{ minHeight: "50%" }}>
          <h2 className="text-2xl font-semibold mb-4">Choose Existing Project</h2>
          <div className="p-6">
            {projects.length > 0 ? (
              <ul className="list-disc pl-5">
                {projects.map((project) => (
                  <li key={project._id} className="mb-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => navigate(`/customize/${project._id}`)}
                    >
                      {project.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-red-500">NO BUILD AND DEPLOYED PROJECTS EXISTS</p>
            )}
          </div>
          <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-r from-transparent to-blue-500 transform rotate-180"></div>
          {/* Continue button */}
          <div className="absolute bottom-4 w-full flex justify-center">
            <Button onClick={() => navigate("/customize")} className="mt-2">
              Continue Customizing Current project
            </Button>
          </div>
        </div>
        

        <div className="relative bg-white shadow-lg rounded-lg p-6" style={{ minHeight: "50%" }}>
          <h2 className="text-2xl font-semibold mb-6">Create New Project</h2>
          <input
            type="text"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            placeholder="Project Name"
            className="border rounded p-5 mr-2 w-full mb-4"
          />
          <Button onClick={handleNewProject} className="mt-4">
            Create
          </Button>
          <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-r from-transparent to-blue-500 transform rotate-180"></div>
        </div>
      </div>
    </div>
  );
};

export default EcomBuild;


