import React, { useState } from "react";
import TopMenu from "Components/Common/TopMenu/TopMenu";
import AddMovie from "Components/AdminPage/AddMovie/AddMovie";
import AddCategory from "Components/AdminPage/AddCategory/AddCategory";
import DeleteMovie from "Components/AdminPage/DeleteMovie/DeleteMovie";
import DeleteCategory from "Components/AdminPage/DeleteCategory/DeleteCategory";
import EditMoviePage from "Components/AdminPage/EditMovie/EditMoviePage";
import EditCategoryPage from "Components/AdminPage/EditCategory/EditCategoryPage";
import "./AdminPage.css";
import { useTopMenu } from "Components/Common/TopMenu/TopMenuLogic";

function AdminPage() {
  const { LogOut, isAdmin } = useTopMenu();
  const [activePanel, setActivePanel] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const toggleModal = (modalName) => {
    setActiveModal((prevModal) => (prevModal === modalName ? null : modalName));
  };

  const togglePanel = (panelName) => {
    setActivePanel((prevPanel) =>
      prevPanel === panelName ? false : panelName
    );
  };

  return (
    <div className="admin-page">
      {/* Top menu stays at the top */}
      <div className="top-menu">
        <TopMenu LogOutSystem={LogOut} VerifyAdmin={isAdmin} />
      </div>
      <div className="admin-container">
        {/* Left: Admin Panels */}
        <div className="admin-panels">
          {activePanel === "addMovie" && (
            <AddMovie closePanel={() => togglePanel("addMovie")} />
          )}
          {activePanel === "editMovie" && (
            <EditMoviePage closePanel={() => togglePanel("editMovie")} />
          )}
          {activePanel === "deleteMovie" && (
            <DeleteMovie closePanel={() => togglePanel("deleteMovie")} />
          )}
          {activePanel === "addCategory" && (
            <AddCategory closePanel={() => togglePanel("addCategory")} />
          )}
          {activePanel === "editCategory" && (
            <EditCategoryPage
              closePanel={() => togglePanel("editCategory")}
              toggleEditMovieModal={() => toggleModal("editMovie")}
            />
          )}
          {activePanel === "deleteCategory" && (
            <DeleteCategory closePanel={() => togglePanel("deleteCategory")} />
          )}
        </div>

        {/* Right: Admin content (header + actions) */}
        <div className="admin-content">
          <div className="admin-page-header">
            <img
              src="/media/Svgs/admin.svg"
              alt="admin"
              className="admin-icon"
            />
            <h1>Admin Zone</h1>
            <p>Welcome to the admin zone! Perform your actions here.</p>
          </div>

          <div className="admin-actions">
            <button
              className="toggle-actions-btn"
              onClick={() => toggleModal("actions")}
            >
              {activeModal === "actions" ? "Hide Actions" : "Show Actions"}
            </button>

            {activeModal === "actions" && (
              <ul className="actions-list">
                <li onClick={() => togglePanel("addMovie")}>Add Movie</li>
                <li onClick={() => togglePanel("editMovie")}>Edit Movie</li>
                <li onClick={() => togglePanel("deleteMovie")}>Delete Movie</li>
                <li onClick={() => togglePanel("addCategory")}>Add Category</li>
                <li onClick={() => togglePanel("editCategory")}>
                  Edit Category
                </li>
                <li onClick={() => togglePanel("deleteCategory")}>
                  Delete Category
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
