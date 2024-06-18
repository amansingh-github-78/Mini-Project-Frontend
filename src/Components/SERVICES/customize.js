import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "flowbite-react";
import "./customize.css"; // Import the CSS file

const Customize = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [customizations, setCustomizations] = useState({});
  const [iframeSrc, setIframeSrc] = useState("");

  useEffect(() => {
    fetchProject(projectId);
  }, [projectId]);

  const fetchProject = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/6671cb8cfb3ec5a88213bfce`);
      const data = await response.json();
      setProject(data);
      setCustomizations(data.customizationData || {});
      setIframeSrc(`http://localhost:3000`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/6671cb8cfb3ec5a88213bfce/customize`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ customizations }),
        }
      );
      const data = await response.json();
      console.log("Changes saved:", data);

      // Update iframe source to reflect changes
      setIframeSrc(
        `http://localhost:3000?customizations=${JSON.stringify(customizations)}`
      );
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleBuildProject = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/build`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("Project built successfully:", data);
    } catch (error) {
      console.error("Error building project:", error);
    }
  };

  const handleBgColorChange = async (e) => {
    const selectedColor = e.target.value;
    const bgColorMap = {
      'Black': 'primary',
      'White': 'secondary',
      'Grey': 'great',
      'LightGreen': 'success',
    };
    const bgColor = bgColorMap[selectedColor] || '';

    if (!project) {
      console.error("Project data is not loaded yet");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/customize/bgcolor`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectName: project.name, bgColor}),
        }
      );
      const data = await response.json();
      console.log(data)
      setCustomizations(data.customizationData || {});
    } catch (error) {
      console.error("Error updating background color:", error);
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <>
      <h1 className="text-center text-8xl">
        Your E Com Site will look like this:
      </h1>
      <div className="customize-container">
        {/* E-Commerce Site iframe */}
        <div className="iframe-container">
          <iframe
            src={iframeSrc}
            title="E-Commerce Site"
            className="w-full h-screen border-2 border-gray-300"
          ></iframe>
        </div>
        {/* Customization Form */}
        <div className="mt-4 ml-2 w-100 customize-form">
          <h1 className="text-center">Customize:</h1>
          <div className="mt-4">
            <label
              htmlFor="bgColor"
              className="block text-sm font-medium text-gray-700"
            >
              Background Color
            </label>
            <select
              id="bgColor"
              name="bgColor"
              value={customizations.bgColor || ""}
              onChange={handleBgColorChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select a color</option>
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Grey">Grey</option>
              <option value="LightGreen">LightGreen</option>
            </select>
          </div>
          <Button onClick={handleSaveChanges} className="mt-4">
            Save Changes
          </Button>
          <Button onClick={handleBuildProject} className="mt-2">
            Build Project
          </Button>
          <p>More Customizing Options Coming In Future.......</p>
        </div>
      </div>
    </>
  );
};

export default Customize;
