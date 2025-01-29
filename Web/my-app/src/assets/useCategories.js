import { useState, useEffect } from "react";

const useCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    
    const fetchCategories = async () => {
      try {
        const token = await localStorage.getItem("jwtToken"); // Retrieve token from context

        if (!token) {
          console.error("No token available, skipping request.");
          return;
        }

        const response = await fetch("http://localhost:3000/api/categories", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch categories:", response.status);
          return;
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []); // Runs once when the component mounts

  return categories;
};

export default useCategories;
