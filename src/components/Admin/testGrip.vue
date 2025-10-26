<template>
  <div class="page-inner">
    <div style="display: flex; justify-content: flex-start">
      <div>
        <button @click="isShowProject = true">Add Project</button>
      </div>
    </div>
    <div style="display: flex; flex-wrap: wrap; margin: 15px 0">
      <div
        v-for="(item, index) in dataProject"
        :key="index"
        style="
          margin: 15px 15px;
          border: 1px dashed black;
          padding: 10px;
          cursor: pointer;
        "
        v-on:click="FindAllTableByProject(item.id)"
      >
        <div>
          <h3>Project Name: {{ item.name }}</h3>
        </div>
        <div>
          <h3>Description {{ item.description }}</h3>
        </div>
      </div>
    </div>
    <div>
      <div style="float: left">
        <button style="border: 1px solid grey" @click="isShowTable = true">
          Add Table
        </button>
        <button v-if="idTable != 0" @click="importFile" style="margin: 0 15px">
          Import Data
        </button>
      </div>
    </div>
    <div
      style="width: 100%; height: 100%; margin-top: 100px"
      v-for="(item, index) in totalRowColum"
      :key="index"
    >
      <div>
        <div>
          <h3>{{ item.colums.table.name }}</h3>
        </div>
      </div>
      <div style="display: flex; margin-left: 100px">
        <div>
          <button v-on:click="ShowField(item.colums.table.id)">
            Add Field
          </button>
        </div>
        <div>
          <button v-on:click="ShowRoleTable(item.colums.table.id)">
            Add Role Table
          </button>
        </div>
        <div>
          <button v-on:click="ShowRow(item.colums.table.id)">Add Row</button>
        </div>
        <div>
          <button v-on:click="ShowExport(item.colums.table.id)">
            Export Data
          </button>
        </div>

        <div>
          <button v-on:click="findAllFieldBytable(item.colums.table.id)">
            Add Role
          </button>
        </div>
      </div>
      <ag-grid-vue
        class="ag-theme-alpine"
        style="width: 1200px; height: 300px; margin: 0 auto"
        :gridOptions="gridOptions"
        :columnDefs="item.colums.columItem"
        :rowData="item.colums.rowItem"
        :defaultColDef="defaultColDef"
        @cellValueChanged="onCellValueChanged"
      />
    </div>
  </div>

  <div v-if="isShowField" class="loading-overlay">
    <div
      style="
        width: 500px;
        background-color: white;
        height: 200px;
        top: 40%;
        left: 40%;
        position: absolute;
        margin: 0 auto;
      "
    >
      <div style="margin-top: 50px">
        <div>
          <label for="">Field Name</label>
          <input v-model="dataFieldDTO.field_name" type="text" />
        </div>
        <div>
          <label for="">Field Type</label>
          <select v-model="dataFieldDTO.fieldType">
            <option value="Text">Text</option>
            <option value="Number">Number</option>
            <option value="DateTime">DateTime</option>
          </select>
        </div>
        <div v-for="(item, index) in listRole" :key="index">
          <div>
            <label for="">Role</label>
            <select v-model="item.role_id">
              <option
                :value="item.id"
                v-for="(item, index) in roleListData"
                :key="index"
              >
                {{ item.name }}
              </option>
            </select>
          </div>
          <div>
            <label for="">can_read</label>
            <input v-model="item.can_read" type="checkbox" />
          </div>
          <div>
            <label for="">can_write</label>
            <input v-model="item.can_write" type="checkbox" />
          </div>
        </div>

        <div>
          <button @click="addRole">Add Role</button>
        </div>

        <div></div>
        <button v-on:click="addField">Add</button>
      </div>
      <div>
        <button @click="isShowField = false">x</button>
      </div>
    </div>
  </div>

  <div v-if="isShowTable" class="loading-overlay">
    <div
      style="
        width: 500px;
        background-color: white;
        height: 200px;
        top: 40%;
        left: 40%;
        position: absolute;
        margin: 0 auto;
      "
    >
      <div style="margin-top: 50px; width: 100%">
        <div>
          <label style="margin: 0 10px">project</label>
          <select v-model="tableDTO.project_id">
            <option
              :value="item.id"
              v-for="(item, index) in projectDataList"
              :key="index"
            >
              {{ item.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="">Name</label>
          <input v-model="tableDTO.name" type="text" />
        </div>
        <div>
          <label for="">Description</label>
          <input v-model="tableDTO.description" type="text" />
        </div>
        <div></div>
        <button v-on:click="addTable">Add</button>
      </div>
      <div>
        <button @click="isShowTable = false">x</button>
      </div>
    </div>
  </div>

  <div v-if="isShowProject" class="loading-overlay">
    <div
      style="
        width: 500px;
        background-color: white;
        height: 200px;
        top: 40%;
        left: 40%;
        position: absolute;
        margin: 0 auto;
      "
    >
      <div style="margin-top: 50px">
        <input v-model="ProjectsDTO.name" type="text" />
        <input v-model="ProjectsDTO.description" type="text" />
        <button v-on:click="addProject">Add</button>
      </div>
      <div>
        <button @click="isShowProject = false">x</button>
      </div>
    </div>
  </div>

  <div v-if="isShowRoleTable" class="loading-overlay">
    <div
      style="
        width: 500px;
        background-color: white;
        height: 200px;
        top: 40%;
        left: 40%;
        position: absolute;
        margin: 0 auto;
      "
    >
      <div style="margin-top: 50px; width: 100%">
        <div>
          <label for="">User</label>
          <select v-model="role_access_raw.user_id">
            <option
              :value="item.id"
              v-for="(item, index) in listUserData"
              :key="index"
            >
              {{ item.username }}
            </option>
          </select>
        </div>
        <div>
          <label for="">Role</label>
          <select v-model="role_access_raw.type">
            <option value="read">Read</option>
            <option value="write">Write</option>
            <option value="delete">Delete</option>
          </select>
        </div>
        <div></div>
        <button v-on:click="addTableRole">Add</button>
      </div>
      <div>
        <button @click="isShowRoleTable = false">x</button>
      </div>
    </div>
  </div>

  <div v-if="isShowImportFile" class="loading-overlay">
    <div
      style="
        width: 500px;
        background-color: white;
        height: 200px;
        top: 40%;
        left: 40%;
        position: absolute;
        margin: 0 auto;
      "
    >
      <div style="margin-top: 50px; width: 100%">
        <div>
          <label for="">File</label>
          <input type="file" accept=".xls, .xlsx" @change="showFile" />
        </div>
        <div></div>
        <button v-on:click="addImportFile">Add</button>
      </div>
      <div>
        <button @click="isShowImportFile = false">x</button>
      </div>
    </div>
  </div>

  <div v-if="isShowRowField" class="loading-overlay">
    <div
      style="
        width: 500px;
        background-color: white;
        height: 200px;
        top: 40%;
        left: 40%;
        position: absolute;
        margin: 0 auto;
      "
    >
      <div style="margin-top: 50px; width: 100%">
        <div>
          <label for="">Field</label>
          <select v-model="roleFieldOne.id_field">
            <option
              :value="item.id"
              v-for="(item, index) in fieldData"
              :key="index"
            >
              {{ item.field_name }}
            </option>
          </select>
        </div>
        <div>
          <label for="">Role</label>
          <select v-model="roleFieldOne.id_role">
            <option
              :value="item.id"
              v-for="(item, index) in roleListData"
              :key="index"
            >
              {{ item.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="">can_read</label>
          <input v-model="roleFieldOne.can_read" type="checkbox" />
        </div>
        <div>
          <label for="">can_write</label>
          <input v-model="roleFieldOne.can_write" type="checkbox" />
        </div>
        <div></div>
        <button v-on:click="addFieldRole">Add</button>
      </div>
      <div>
        <button @click="isShowRowField = false">x</button>
      </div>
    </div>
  </div>
  <div v-if="isLoading" class="loading-overlay">
    <div class="spinner"></div>
    <p>載入中......</p>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import axios from "axios";
import { useCounterStore } from "../../store";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const { proxy } = getCurrentInstance();
const hostName = proxy?.hostname;
const store = useCounterStore();
const isLoading = ref(false);
const isShowField = ref(false);
const updateDataField = ref({
  row_id: 0,
  field_id: 0,
  field_key: "",
  value_text: null,
  data: null,
  value_date: null,
  value_datetime: null,
  ValueBoolean: null,
});

const listUserData = ref([]);
const rowDTO = ref({
  table_id: 0,
});

const tableDTO = ref({
  project_id: 0,
  name: "",
  description: "",
});

const projectDataList = ref([]);
const listRole = ref([]);

const dataFieldDTO = ref({
  table_id: 0,
  field_key: "",
  field_name: "",
  fieldType: "",
  field_options: "",
  sort_order: 0,
  listRoles: [],
});

const roleFieldOne = ref({
  id_field: 0,
  id_role: 0,
  can_read: null,
  can_write: null,
});

const dataProject = ref([]);
const dataTable = ref([]);
const colum = ref([]);
const row = ref([]);
const totalRowColum = ref([]);
const idTable = ref(0);
const role = store.getRoleList();
const roleListData = ref([]);
const isShowTable = ref(false);
const isShowProject = ref(false);
const isShowRoleTable = ref(false);
const isShowImportFile = ref(false);
const selectFile = ref(null);
const fieldData = ref([]);
const isShowRowField = ref(false);

const addFieldRole = async () => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";

  const res = await axios.post(
    hostName + "/api/FieldDefinition/AddRole",
    roleFieldOne.value,
    getToken()
  );

  console.log(res);
  if (res.data.success) {
    Swal.fire("Success");
    FindAllTableByProject(idTable.value);
  }

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
};

const findAllFieldBytable = async (id) => {
  const res = await axios.get(
    hostName + `/api/Table/FindAllFieldByTable?id=${id}`,
    getToken()
  );

  if (res.data.success) {
    fieldData.value = res.data.content.data;
    isShowRowField.value = true;

    console.log("Data Field: ", res);
  }
};
const ShowExport = async (id) => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";
  const res = await axios.post(
    hostName + `/api/Table/ExportExcel?data=${id}`,
    {},
    {
      ...getToken(),
      responseType: "blob",
    }
  );
  if (res.status === 200) {
    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
};

const addImportFile = async () => {
  if (selectFile.value === null) {
    Swal.fire("File null");
    return;
  }

  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";

  const form = new FormData();
  form.append("id_project", idTable.value);
  form.append("file", selectFile.value);

  const res = await axios.post(
    hostName + "/api/Table/importData",
    form,
    getToken()
  );
  console.log(res);
  if (res.data.success) {
    Swal.fire("Success");
    FindAllTableByProject(idTable.value);
  }

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
};

const showFile = (even) => {
  const file = even.target.files[0];
  if (file) {
    selectFile.value = file;
  }
};
const importFile = async () => {
  isShowImportFile.value = true;
};
const findAllUser = async () => {
  const res = await axios.get(
    hostName + "/api/User/FindAll?page=1&pageSize=2000",
    getToken()
  );
  if (res.data.success) {
    listUserData.value = res.data.content.data;
  }
};

const ProjectsDTO = ref({
  name: "",
  description: "",
});

const role_access_raw = ref({
  table_id: 0,
  user_id: 0,
  role_id: 0,
  type: "",
});

const addTableRole = async () => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";
  const res = await axios.post(
    hostName + "/api/FieldDefinition/AddUserRoleTable",
    role_access_raw.value,
    getToken()
  );
  if (res.data.success) {
    Swal.fire("Success");
    FindAllTableByProject(idTable.value);
  }

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
};
const ShowRoleTable = (id) => {
  role_access_raw.value.table_id = id;
  isShowRoleTable.value = true;
};
const addProject = async () => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";

  const res = await axios.post(
    hostName + "/api/projects/Add",
    ProjectsDTO.value,
    getToken()
  );
  if (res.data.success) {
    Swal.fire("Success");
    findAllProject();
  } else {
    Swal.fire("Error");
  }

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
};

const addRow = async () => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";

  const res = await axios.post(
    hostName + "/api/Data_rows_eav/Add",
    rowDTO.value,
    getToken()
  );
  if (res.data.success) {
    Swal.fire("Success");
    if (idTable.value != 0) FindAllTableByProject(idTable.value);
  }

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
};

const ShowRow = (id) => {
  // isShowRow.value = true
  rowDTO.value.table_id = id;
  addRow();
};
const addTable = async () => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";

  // tableDTO.value.project_id = idTable.value
  const res = await axios.post(
    hostName + "/api/Table/Add",
    tableDTO.value,
    getToken()
  );
  console.log(res);
  if (res.data.success) {
    Swal.fire("Success");
    FindAllTableByProject(idTable.value);
  }

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
};

const FindAllProject = async () => {
  const res = await axios.get(
    hostName + "/api/projects/FindAll?page=1&pageSize=20000",
    getToken()
  );
  if (res.data.success) {
    projectDataList.value = res.data.content.data;
  }
};
const addField = async () => {
  // console.log(listRole.value)
  // return
  let checkRole = 0;
  if (listRole.value.length > 0) {
    listRole.value.forEach((i) => {
      if (i.role_id == 0) checkRole += 1;
    });

    if (checkRole != 0) {
      Swal.fire("role null");
      return;
    }

    dataFieldDTO.value.listRoles = listRole.value;
  } else {
    Swal.fire("role null");
    return;
  }

  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";

  const res = await axios.post(
    hostName + "/api/FieldDefinition/Add",
    dataFieldDTO.value,
    getToken()
  );
  console.log(res);
  if (res.data.success) {
    FindAllTableByProject(idTable.value);
  }

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
};

const FindAllRole = async () => {
  const res = await axios.get(
    hostName + "/api/Role/FindAll?page=1&pageSize=2000",
    getToken()
  );
  if (res.data.success) {
    roleListData.value = res.data.content.data;
  }
};

const ShowField = (id) => {
  isShowField.value = true;
  dataFieldDTO.value.table_id = id;
};

const addRole = () => {
  listRole.value.push({ role_id: 0, can_read: false, can_write: false });
};

const fomatDate = (valueString) => {
  if (!valueString || typeof valueString != "string") return null; // " typeof valueString != "string"" kiểm tra xem có phải kiểu dữ liệu "string không", "!valueString" kiểm tra xem có dữ liệu không

  // Kiểm tra chỉ parse những chuỗi có dấu ngày tháng năm
  if (!/[/: -]/.test(valueString)) return null;
  // parse trực tiếp (IOS hoặc có timezone)
  let d = dayjs(valueString);
  if (d.isValid()) return d.toDate();

  // Thử fomat MM/DD/YYYY HH:mm:ss Z
  d = dayjs(valueString, "MM/DD/YYYY HH:mm:ss Z", true);
  if (d.isValid()) return d.toDate();

  d = dayjs(valueString, "DD/MM/YYYY HH:mm:ss", true);
  if (d.isValid()) return d.toDate();

  return null;
};

const fomatFormColum = (value) => {
  if (!value) return "";

  const d = new Date(value);
  return d.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
const FindAllTableByProject = async (id) => {
  console.log("Role: ", role);
  totalRowColum.value = [];
  row.value = [];
  colum.value = [];
  idTable.value = id;
  const res = await axios.get(
    hostName + `/api/Table/FindOneTable?id=${id}&page=1&pageSize=20`,
    getToken()
  );

  /*
   *const columnDefs = ref([
  { field: "id", hide: true },
  { field: "make", sortable: true, filter: true, editable: true },
  { field: "model", sortable: true, filter: true, editable: true },
  { field: "price", sortable: true, filter: true, editable: true },
]);
   */

  // console.log("Row: ", row.value);
  // console.log("Colum: ", colum.value);

  if (res.data.success) {
    res.data.content.data.map((item) => {
      if (item.field.length > 0) {
        item.field.forEach((item2) => {
          // const canReadColumn =
          //   item2.role?.some(
          //     (x) => role?.includes(x.role_name) && x.can_read
          //   ) ?? false;
          if (colum.value.length <= 0) {
            // Add Colum
            if (
              item2.type === "Date" ||
              item2.type === "Datetime" ||
              item2.type === "DateTime"
            ) {
              colum.value.push({ field: "id_row", hide: true });
              colum.value.push({
                field: item2.field_name,
                headerName: item2.field_name,
                sortable: true,
                hide: !item2.role?.some(
                  (x) => role?.includes(x.role_name) && x.can_read
                ),
                filter: "agDateColumnFilter",
                editable: () => {
                  return (
                    item2.role?.some(
                      (x) => role?.includes(x.role_name) && x.can_write
                    ) ?? false
                  );
                },
                cellEditor: "agDateStringCellEditor",
                valueFormatter: (param) => fomatFormColum(param.value),
              });

              colum.value.push({
                field: item2.field_name + "_id",
                hide: true,
              });
            } else if (item2.type === "Number" || item2.type === "number") {
              colum.value.push({ field: "id_row", hide: true });
              colum.value.push({
                field: item2.field_name + "_id",
                hide: true,
              });
              colum.value.push({
                field: item2.field_name,
                headerName: item2.field_name,
                hide: !item2.role?.some(
                  (x) => role?.includes(x.role_name) && x.can_read
                ),
                editable: () => {
                  return (
                    item2.role?.some(
                      (x) => role?.includes(x.role_name) && x.can_write
                    ) ?? false
                  );
                },
                cellEditor: "agTextCellEditor",
                valueParser: (param) => parseFloat(param.newValue) || 0,
                valueFormatter: (param) => {
                  return param.value != null
                    ? param.value.toLocaleString("vi-VN")
                    : "";
                },
                cellStyle: { textAlign: "right" }, // Căn lề phải
              });
            } else {
              colum.value.push({ field: "id_row", hide: true });
              colum.value.push({
                field: item2.field_name + "_id",
                hide: true,
              });
              colum.value.push({
                field: item2.field_name,
                hide: !item2.role?.some(
                  (x) => role?.includes(x.role_name) && x.can_read
                ),
                sortable: true,
                filter: true,
                editable: () => {
                  return (
                    item2.role?.some(
                      (x) => role?.includes(x.role_name) && x.can_write
                    ) ?? false
                  );
                },
              });
            }
          } else if (colum.value.length > 0) {
            if (
              item2.type === "Date" ||
              item2.type === "Datetime" ||
              item2.type === "DateTime"
            ) {
              colum.value.push({
                field: item2.field_name + "_id",
                hide: true,
              });
              colum.value.push({
                field: item2.field_name,
                headerName: item2.field_name,
                hide: !item2.role?.some(
                  (x) => role?.includes(x.role_name) && x.can_read
                ),
                editable: () => {
                  return (
                    item2.role?.some(
                      (x) => role?.includes(x.role_name) && x.can_write
                    ) ?? false
                  );
                },
                filter: "agDateColumnFilter",
                cellEditor: "agDateStringCellEditor",
                valueFormatter: (param) => fomatFormColum(param.value),
              });
            } else if (item2.type === "Number" || item2.type === "number") {
              colum.value.push({
                field: item2.field_name + "_id",
                hide: true,
              });
              colum.value.push({
                field: item2.field_name,
                headerName: item2.field_name,
                hide: !item2.role?.some(
                  (x) => role?.includes(x.role_name) && x.can_read
                ),
                editable: () => {
                  return (
                    item2.role?.some(
                      (x) => role?.includes(x.role_name) && x.can_write
                    ) ?? false
                  );
                },
                // cellEditor: "agNumberCellEditor", // "agNumberCellEditor" là cho phép nhập số
                // valueParser: (param) => parseFloat(param.newValue) || 0,
                valueParser: (param) =>
                  isNaN(param.newValue)
                    ? param.oldValue
                    : parseFloat(param.newValue),
                valueFormatter: (param) => {
                  return param.value != null
                    ? param.value.toLocaleString("vi-VN")
                    : "";
                },
                cellStyle: { textAlign: "center" }, // Căn ở giữa, ngoài ra còn các thuộc tính khác: right,...
              });
            } else {
              colum.value.push({
                field: item2.field_name + "_id",
                hide: true,
              });
              colum.value.push({
                field: item2.field_name,
                hide: !item2.role?.some(
                  (x) => role?.includes(x.role_name) && x.can_read
                ),
                sortable: true,
                filter: true,
                editable: () => {
                  return (
                    item2.role?.some(
                      (x) => role?.includes(x.role_name) && x.can_write
                    ) ?? false
                  );
                },
              });
            }
          }
          if (item2.rows.length > 0) {
            // Add Data
            if (row.value.length <= 0) {
              item2.rows.map((item3) => {
                if (item3.field_row != null) {
                  const fieldData = item3.field_row.field_name;
                  const field_id = item3.field_row.field_name + "_id";
                  if (item3.field_row.valueBoolean !== null)
                    row.value.push({
                      id_row: item3.id,
                      [fieldData]: item3.field_row.valueBoolean, // Dùng [fieldData] như này để gán key động
                      [field_id]:
                        item3.field_row.field_id + ", " + item3.field_row.id,
                    });
                  else if (item3.field_row.value_date !== null)
                    row.value.push({
                      id_row: item3.id,
                      [fieldData]: item3.field_row.value_date,
                      [field_id]:
                        item3.field_row.field_id + ", " + item3.field_row.id,
                    });
                  else if (item3.field_row.value_datetime !== null)
                    row.value.push({
                      id_row: item3.id,
                      [fieldData]: item3.field_row.value_datetime,
                      [field_id]:
                        item3.field_row.field_id + ", " + item3.field_row.id,
                    });
                  else if (item3.field_row.value_number !== null)
                    row.value.push({
                      id_row: item3.id,
                      [fieldData]: item3.field_row.value_number,
                      [field_id]:
                        item3.field_row.field_id + ", " + item3.field_row.id,
                    });
                  else if (item3.field_row.value_text !== null) {
                    const checkDate = fomatDate(item3.field_row.value_text);
                    if (checkDate) {
                      row.value.push({
                        id_row: item3.id,
                        [fieldData]: checkDate,
                        [field_id]:
                          item3.field_row.field_id + ", " + item3.field_row.id,
                      });
                    } else {
                      if (item3.field_row.id) {
                        row.value.push({
                          id_row: item3.id,
                          [fieldData]: item3.field_row.value_text,
                          [field_id]:
                            item3.field_row.field_id +
                            ", " +
                            item3.field_row.id,
                        });
                      } else
                        row.value.push({
                          id_row: item3.id,
                          [fieldData]: item3.field_row.value_text,
                          [field_id]: item3.field_row.field_id,
                        });
                    }
                  }
                } else if (item3.field_row === null) {
                  const field_id3 = item2.field_name + "_id";
                  row.value.push({
                    id_row: item3.id,
                    [field_id3]: item2.id + ", " + 0,
                  });
                }
              });
            } else if (row.value.length > 0) {
              item2.rows.map((item4, index4) => {
                if (!row.value[index4]) row.value[index4] = {};
                if (item4.field_row !== null) {
                  const field_id2 = item4.field_row.field_name + "_id";
                  if (!row.value[index4]) row.value[index4] = {}; // Khai báo "object" mới ở vị trí "index" mới
                  if (item4.field_row.value_text !== null) {
                    const checkDate2 = fomatDate(item4.field_row.value_text);

                    if (checkDate2) {
                      row.value[index4][item4.field_row.field_name] =
                        checkDate2;
                      row.value[index4][field_id2] =
                        item4.field_row.field_id + ", " + item4.field_row.id;
                    } else {
                      row.value[index4][item4.field_row.field_name] =
                        item4.field_row.value_text;
                      row.value[index4][field_id2] =
                        item4.field_row.field_id + ", " + item4.field_row.id;
                    }
                  } else if (item4.field_row.valueBoolean !== null) {
                    row.value[index4][item4.field_row.field_name] =
                      item4.field_row.valueBoolean;
                    row.value[index4][field_id2] =
                      item4.field_row.field_id + ", " + item4.field_row.id;
                  } else if (item4.field_row.value_date !== null) {
                    row.value[index4][item4.field_row.field_name] =
                      item4.field_row.value_date;
                    row.value[index4][field_id2] =
                      item4.field_row.field_id + ", " + item4.field_row.id;
                  } else if (item4.field_row.value_datetime !== null) {
                    row.value[index4][item4.field_row.field_name] =
                      item4.field_row.value_datetime;
                    row.value[index4][field_id2] =
                      item4.field_row.field_id + ", " + item4.field_row.id;
                  } else if (item4.field_row.value_number !== null) {
                    row.value[index4][item4.field_row.field_name] =
                      item4.field_row.value_number;
                    row.value[index4][field_id2] =
                      item4.field_row.field_id + ", " + item4.field_row.id;
                  } else {
                    if (item4.field_row.id != null)
                      row.value[index4][field_id2] =
                        item4.field_row.field_id + ", " + item4.field_row.id;
                    else
                      row.value[index4][field_id2] = item4.field_row.field_id;
                    row.value[index4][item4.field_row.field_name] = "";
                  }
                } else if (item4.field_row === null) {
                  const field_id3 = item2.field_name + "_id";
                  row.value[index4][field_id3] = item2.id + ", " + 0;
                }
                // if (item4.field_row !== null) {
                //   console.log("Data item 4: ", item4.field_row.field_name);
                //   console.log("Index 4: ", index4);
                // }
              });
            }
          }
        });
      }
      totalRowColum.value.push({
        colums: {
          columItem: colum.value,
          rowItem: row.value,
          table: {
            id: item.id,
            name: item.name,
            project_id: item.project_id,
            project_name: item.project_name,
            description: item.description,
          },
        },
      });

      colum.value = [];
      row.value = [];
    });
    dataTable.value = res.data.content.data;
    console.log(res);
    console.log("Total Data: ", totalRowColum.value);
  }

  console.log(res);
};

const onCellValueChanged = async (event) => {
  const id = event.colDef.field + "_id";
  const data = event.data[id];
  const rowId = event.data.id_row;
  console.log("Data abc: ", data);
  console.log("Row Id data: ", rowId);
  console.log("Dòng dữ liệu sau khi sửa:", event.data);

  if (rowId === null || rowId === undefined) {
    alert("Data Null");
    return;
  }

  // Kiểm tra xem trong chuỗi phải có 2 phần tử, và 2 phần tử đó phải là số
  const parts = data.split(",").map((x) => x.trim()); // Cắt chuỗi sau và trước dấu "," sau đó bỏ khoảng trắng
  let checkDataIntAnd2 =
    parts.length === 2 && parts.every((x) => !isNaN(parseFloat(x))); // "parts.length === 2" kiểm tra chuổi phải có 2 phần tử, "parts.every(x => !isNaN(parseFloat(x)))" kiểm tra xem có phải số hay không, "!isNaN" nghĩa là đây là số
  if (!checkDataIntAnd2) {
    alert("Không phải số");
    return;
  }

  console.log("Cột thay đổi:", event.colDef.field);
  console.log("Giá trị mới:", event.newValue);
  console.log("Dòng dữ liệu sau khi sửa:", event.data);
  console.log("Field Id: ", event.data[id]);

  let dataColum = data.split(",").pop().trim(); // Lấy ra dữ liệu cuối cùng sau dấu ","
  let colum = data.split(",").slice(0, 1).join(",").trim(); // Lấy ra dữ liệu đầu tiên trước dấu ","

  console.log("First Data: ", colum);
  console.log("Last Data: ", dataColum);

  const converInt = parseInt(dataColum);
  const checkIntColum = /^-?\d+$/.test(colum);
  const checkInt = !isNaN(converInt) && converInt.toString() === dataColum;

  const convertIntColum = parseInt(colum);
  if (!checkInt || !checkIntColum) {
    alert("Không phải số");
    return;
  }

  updateDataField.value.data = event.newValue;
  updateDataField.value.row_id = parseInt(rowId);
  updateDataField.value.field_id = convertIntColum;
  if (converInt === 0) {
    const res = await axios.post(
      hostName + "/api/Data_values_eav/Add",
      updateDataField.value,
      getToken()
    );
    console.log(res);
    console.log("Dòng dữ liệu mới:", event.data);
  } else {
    const res = await axios.put(
      hostName + `/api/Data_values_eav/Update?id=${converInt}`,
      updateDataField.value,
      getToken()
    );
    console.log(res);
  }

  /*const str = "233, 3, 4";
  let catchuoi = str.split(",").pop().trim(); // Đây là cắt chuỗi dùng hàm "split", dùng "pop" để lấy ra phần tử cuối cùng
  console.log(catchuoi);

  const str2 = "2223, 3";
  let catchuoi2 = str2.split(",");
  catchuoi2.pop();
  let gopchuoi2 = catchuoi2.join(",");
  console.log(gopchuoi2.trim());

  const str3 = "2234, 8483, 3123";
  let catchuoi3 = str3
    .split(",")
    .map((x) => x.trim())
    .slice(-2)
    .join(","); // Lấy ra 2 phần tử ở cuối cùng sau dấu ","
  console.log("Chuỗi 3: ", catchuoi3);

  // Lấy ra phần tử đầu tiên
  const str4 = "sasd, adasd";
  let data1 = str4.split(",")[0].trim(); // Cách 1
  let data1s = str4.split(",").slice(0, 1).join(",").trim(); // Cách 2
  console.log("Data đầu tiên s: ", data1s);
  console.log("Data đầu tiên: ", data1); */

  // Ví dụ: Gọi API để cập nhật giá trị trong DB
  // axios.put(
  //   hostName + `/api/Table/UpdateField`,
  //   {
  //     id: event.data.id, // giả sử dòng có trường id
  //     field: event.colDef.field,
  //     value: event.newValue,
  //   },
  //   getToken()
  // )
  // .then(res => console.log("Cập nhật thành công"))
  // .catch(err => console.error("Lỗi khi cập nhật:", err));
};
//const dataRowField = (list) => {};
const findAllProject = async () => {
  const res = await axios.get(
    hostName + "/api/projects/FindAll?page=1&pageSize=20",
    getToken()
  );
  dataProject.value = res.data.content.data;
  console.log(dataProject.value);
};

const getToken = () => {
  var result = {
    headers: { Authorization: `Bearer ${store.getToken}` },
  };

  return result;
};
// Định nghĩa cột
// const columnDefs = ref([
//   { field: "id", hide: true },
//   { field: "make", sortable: true, filter: true, editable: true },
//   { field: "model", sortable: true, filter: true, editable: true },
//   { field: "price", sortable: true, filter: true, editable: true },
// ]);

// // Dữ liệu mẫu
// const rowData = ref([
//   { id: 1, make: "Toyota", model: "Celica", price: 35000 },
//   { id: 2, make: "Ford", model: "Mondeo", price: 32000 },
//   { id: 3, make: "Porsche", model: "Boxster", price: 72000 },
// ]);

// Config mặc định cho cột
const defaultColDef = ref({
  resizable: true,
  sortable: true,
  filter: true,
});

const gridOptions = ref({
  rowModelType: "clientSide",
  // animateRows: false,
  suppressColumnVirtualisation: false,
  suppressRowVirtualisation: false,
  suppressColumnMoveAnimation: false,
  suppressMovableColumns: false,
  // suppressColumnMoveAnimation: true, // Không cho hiệu ứng di chuyển cột
  // suppressMovableColumns: true, // Không cho di chuyển cột
  suppressDragLeaveHidesColumns: true,
  domLayout: "normal",
  pagination: true,
  paginationPageSize: 2, // mỗi trang 2 dòng
  paginationPageSizeSelector: [2, 5, 10, 20, 50, 100],
  animateRows: true,
  suppressScrollOnNewData: true,
});

onMounted(() => {
  findAllProject();
  FindAllRole();
  FindAllProject();
  findAllUser();
});
</script>

<style scoped>
/* Màn hình chờ */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  pointer-events: all; /* Kích hoạt lớp phủ ngăn tương tác */
}

/* Ngăn người dùng thao tác khi đang load */
body.loading {
  pointer-events: none; /* Ngăn tất cả tương tác */
  user-select: none; /* Ngăn chọn văn bản */
}
</style>
