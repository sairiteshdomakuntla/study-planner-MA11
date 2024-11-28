import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { Tag } from "primereact/tag";

import { v4 as uuidv4 } from "uuid";

const SubTaskManagement = ({ subTasks, setSubTasks }) => {
  let emptySubTask = {
    subtaskid: "",
    taskid: "",
    subtask: "",
    desc: "",
    link: "",
    completed: false,
  };

  const [stDialog, setStDialog] = useState(false);
  const [deleteStDialog, setDeleteStDialog] = useState(false);
  const [deleteStsDialog, setDeleteStsDialog] = useState(false);
  const [subTask, setSubTask] = useState(emptySubTask);
  const [selectedSubTasks, setSelectedSubTasks] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const editSubTask = (subTaskRow) => {
    setSubTask({ ...subTaskRow });
    setStDialog(true);
  };

  const confirmDeleteSubTask = (subTaskRow) => {
    setSubTask(subTaskRow);
    setDeleteStDialog(true);
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag 
        severity={rowData.completed ? "success" : "danger"} 
        value={rowData.completed ? "Completed" : "Pending"}
        icon={rowData.completed ? "pi pi-check" : "pi pi-times"}
      />
    );
  };

  const linkBodyTemplate = (rowData) => {
    return rowData.link ? (
      <a 
        href={rowData.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-600 hover:underline"
      >
        Open Link
      </a>
    ) : (
      <span className="text-gray-400">No Link</span>
    );
  };

  const header = (
    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-t-lg">
      <h2 className="text-xl font-bold text-gray-700 m-0">SubTask Management</h2>
      <span className="p-input-icon-left">
        <i className="pi pi-search text-gray-400" />
        <InputText
          type="search"
          className="p-inputtext-sm"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search tasks..."
        />
      </span>
    </div>
  );

  const saveSubTask = async () => {
    setSubmitted(true);

    if (subTask.subtask.trim()) {
      let _sts = [...subTasks];
      let _subTask = { ...subTask };

      if (subTask.subtaskid) {
        const index = findIndexById(subTask.subtaskid);
        _sts[index] = _subTask;
        toast.current.show({
          severity: "success",
          summary: "Updated",
          detail: "SubTask Updated Successfully",
          life: 3000,
        });
      } else {
        _subTask.subtaskid = createId();
        _sts.push(_subTask);
        toast.current.show({
          severity: "success",
          summary: "Created",
          detail: "New SubTask Added",
          life: 3000,
        });
      }

      setSubTasks(_sts);
      setStDialog(false);
      setSubTask(emptySubTask);
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex">
        <Button 
          icon="pi pi-pencil" 
          className="p-button-rounded p-button-success mr-2" 
          tooltip="Edit SubTask"
          onClick={() => editSubTask(rowData)}
        />
        <Button 
          icon="pi pi-trash" 
          className="p-button-rounded p-button-danger" 
          tooltip="Delete SubTask"
          onClick={() => confirmDeleteSubTask(rowData)}
        />
      </div>
    );
  };

  const createId = () => uuidv4();

  const findIndexById = (id) => 
    subTasks.findIndex(task => task.subtaskid === id);

  const dialogFooter = (onConfirm, cancelLabel = "Cancel", confirmLabel = "Save") => (
    <div className="flex justify-end gap-2">
      <Button 
        label={cancelLabel} 
        icon="pi pi-times" 
        className="p-button-text" 
        onClick={() => {
          setStDialog(false);
          setDeleteStDialog(false);
          setDeleteStsDialog(false);
        }}
      />
      <Button 
        label={confirmLabel} 
        icon="pi pi-check" 
        className="p-button-primary" 
        onClick={onConfirm}
      />
    </div>
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Toast ref={toast} />
      
      <Toolbar 
        className="mb-4 bg-gray-100 rounded-lg" 
        left={() => (
          <div className="flex gap-2">
            <Button 
              label="New SubTask" 
              icon="pi pi-plus" 
              className="p-button-success" 
              onClick={() => {
                setSubTask(emptySubTask);
                setStDialog(true);
              }}
            />
            <Button 
              label="Delete Selected" 
              icon="pi pi-trash" 
              className="p-button-danger" 
              disabled={!selectedSubTasks || !selectedSubTasks.length}
              onClick={() => setDeleteStsDialog(true)}
            />
          </div>
        )}
        right={() => (
          <div className="flex gap-2">
            <FileUpload
              mode="basic"
              name="csv-import"
              accept=".csv"
              customUpload
              uploadHandler={(e) => {
                // Existing CSV import logic
              }}
              chooseLabel="Import CSV"
              className="p-button-secondary"
            />
            <Button 
              label="Export CSV" 
              icon="pi pi-upload" 
              className="p-button-help" 
              onClick={() => dt.current.exportCSV()}
            />
          </div>
        )}
      />

      <DataTable
        ref={dt}
        value={subTasks}
        selection={selectedSubTasks}
        onSelectionChange={(e) => setSelectedSubTasks(e.value)}
        dataKey="subtaskid"
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} subtasks"
        globalFilter={globalFilter}
        header={header}
        responsiveLayout="scroll"
        className="rounded-lg"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="subtask" header="SubTask" sortable className="font-bold" />
        <Column field="desc" header="Description" sortable />
        <Column field="link" header="Link" body={linkBodyTemplate} />
        <Column 
          field="completed" 
          header="Status" 
          body={statusBodyTemplate} 
          sortable 
        />
        <Column 
          body={actionBodyTemplate} 
          exportable={false} 
          style={{ minWidth: "8rem" }} 
        />
      </DataTable>

      <Dialog
        visible={stDialog}
        style={{ width: "450px" }}
        header="SubTask Details"
        modal
        className="p-fluid"
        footer={dialogFooter(saveSubTask)}
        onHide={() => setStDialog(false)}
      >
        <div className="field mb-4">
          <label htmlFor="subTask" className="block mb-2">SubTask Name</label>
          <InputText
            id="subTask"
            value={subTask.subtask}
            onChange={(e) => setSubTask({...subTask, subtask: e.target.value})}
            required
            className={classNames({
              "p-invalid": submitted && !subTask.subtask
            })}
          />
          {submitted && !subTask.subtask && (
            <small className="p-error">SubTask name is required.</small>
          )}
        </div>

        <div className="field mb-4">
          <label htmlFor="description" className="block mb-2">Description</label>
          <InputText
            id="description"
            value={subTask.desc}
            onChange={(e) => setSubTask({...subTask, desc: e.target.value})}
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="link" className="block mb-2">URL (Optional)</label>
          <InputText
            id="link"
            value={subTask.link}
            onChange={(e) => setSubTask({...subTask, link: e.target.value})}
          />
        </div>

        <div className="field">
          <label className="block mb-2">Completed</label>
          <InputSwitch
            checked={subTask.completed}
            onChange={(e) => setSubTask({...subTask, completed: e.value})}
          />
        </div>
      </Dialog>

      {/* Delete Dialogs */}
      <Dialog
        visible={deleteStDialog}
        style={{ width: "450px" }}
        header="Confirm Deletion"
        modal
        footer={dialogFooter(
          () => {
            setSubTasks(subTasks.filter(s => s.subtaskid !== subTask.subtaskid));
            setDeleteStDialog(false);
            toast.current.show({
              severity: "success",
              summary: "Deleted",
              detail: "SubTask Removed",
              life: 3000
            });
          },
          "No",
          "Yes, Delete"
        )}
        onHide={() => setDeleteStDialog(false)}
      >
        <div className="confirmation-content flex items-center">
          <i className="pi pi-exclamation-triangle mr-3 text-3xl text-orange-500" />
          <span>Are you sure you want to delete <b>{subTask.subtask}</b>?</span>
        </div>
      </Dialog>

      <Dialog
        visible={deleteStsDialog}
        style={{ width: "450px" }}
        header="Confirm Multiple Deletions"
        modal
        footer={dialogFooter(
          () => {
            setSubTasks(subTasks.filter(s => !selectedSubTasks.includes(s)));
            setDeleteStsDialog(false);
            setSelectedSubTasks(null);
            toast.current.show({
              severity: "success",
              summary: "Deleted",
              detail: "Selected SubTasks Removed",
              life: 3000
            });
          },
          "No",
          "Yes, Delete All"
        )}
        onHide={() => setDeleteStsDialog(false)}
      >
        <div className="confirmation-content flex items-center">
          <i className="pi pi-exclamation-triangle mr-3 text-3xl text-orange-500" />
          <span>Are you sure you want to delete the selected SubTasks?</span>
        </div>
      </Dialog>
    </div>
  );
};

export default SubTaskManagement;