<template>
  <div class="page-inner">
    <div class="page-header">
      <h3 class="fw-bold mb-3">DataTables.Net</h3>
      <ul class="breadcrumbs mb-3">
        <li class="nav-home">
          <a href="#">
            <i class="icon-home"></i>
          </a>
        </li>
        <li class="separator">
          <i class="icon-arrow-right"></i>
        </li>
        <li class="nav-item">
          <a href="#">Tables</a>
        </li>
        <li class="separator">
          <i class="icon-arrow-right"></i>
        </li>
        <li class="nav-item">
          <a href="#">Datatables</a>
        </li>
      </ul>
    </div>
    <div>
      <div style="width: 150px; margin: 15px 0">
        <button @click="isShowProject = true">Add Project</button>
      </div>
      <div style="display: flex; flex-wrap: wrap">
        <div
          @click="FindAllTableByProject(item.id)"
          v-for="(item, index) in dataProjects"
          :key="index"
          style="
            border: 1px dashed grey;
            width: 300px;
            padding: 10px;
            cursor: pointer;
            margin-bottom: 15px;
            margin-left: 10px;
          "
        >
          <h3>Project Name: {{ item.name }}</h3>
          <h3>Người tạo: {{ item.user_create }}</h3>
        </div>
      </div>
    </div>
    <div class="row">
      <div>
        <div style="width: 200px">
          <button @click="isShowTable = true">Add Table</button>
          <button
            v-if="idTable != 0"
            @click="importFile"
            style="margin: 0 15px"
          >
            Import Data
          </button>
        </div>
        <div v-for="(item, index) in projectData" :key="index" style="margin-top: 60px;">
          <div>
            <div>
              <h3>{{ item.name }}</h3>
            </div>
            <div style="display: flex;">
              <div>
                <button v-on:click="ShowRow(item.id)">Add Row</button>
              </div>
              <div style="margin: 0 15px;">
                <button v-on:click="ShowField(item.id)">Add Field</button>
              </div>
              <div>
                <button v-on:click="ShowRoleTable(item.id)">
                  Add Role Table
                </button>
              </div>
              <div style="margin: 0 15px;">
                <button v-on:click="ShowExport(item.id)">Export Data</button>
              </div>
            </div>
          </div>
          <div>
            <div style="display: flex">
              <div
                v-for="(itemfield, indexfield) in item.field"
                :key="indexfield"
                style="margin: 0 15px"
              >
                <!-- "itemfield.role.some(x => role.some(x1 => x1 === x.role_name) && x.can_read)" Đây là tìm dữ liệu trong 2 mảng xem có dữ liệu giống nhau hay không -->
                <div
                  v-if="
                    itemfield.role.some(
                      (x) => role.some((x1) => x1 === x.role_name) && x.can_read
                    )
                  "
                >
                  <div>
                    <div>
                      <h3>{{ itemfield.field_name }}</h3>
                    </div>
                    <div>
                      <button @click="ShowRowField(itemfield.id)">
                        Add role
                      </button>
                    </div>
                  </div>
                  <div>
                    <div
                      v-for="(itemRow, indexRow) in itemfield.rows"
                      :key="indexRow"
                    >
                      <div v-if="itemRow.field_row != null">
                        <p
                          v-if="
                            itemRow.field_row.valueBoolean != null ||
                            itemRow.field_row.valueBoolean != ''
                          "
                        >
                          {{ itemRow.field_row.valueBoolean }}
                        </p>
                        <p
                          v-if="
                            itemRow.field_row.value_date != null ||
                            itemRow.field_row.value_date != ''
                          "
                        >
                          {{ itemRow.field_row.value_date }}
                        </p>
                        <p
                          v-if="
                            itemRow.field_row.value_datetime != null ||
                            itemRow.field_row.value_datetime != ''
                          "
                        >
                          {{ itemRow.field_row.value_datetime }}
                        </p>
                        <p
                          v-if="
                            itemRow.field_row.value_number != null ||
                            itemRow.field_row.value_number != ''
                          "
                        >
                          {{ itemRow.field_row.value_number }}
                        </p>
                        <p
                          v-if="
                            itemRow.field_row.value_text != null ||
                            itemRow.field_row.value_text != ''
                          "
                        >
                          {{ itemRow.field_row.value_text }}
                        </p>
                      </div>
                      <div v-else-if="itemRow.field_row == null">
                        <div
                          v-if="
                            itemfield.role.some(
                              (x) =>
                                role.some((x1) => x1 === x.role_name) &&
                                x.can_write
                            )
                          "
                        >
                          <div style="display: flex">
                            <!-- 
                                "@focus" này là bắt sự kiện khi ấn vào ô input
                                "@blur" này là bắt sự kiện khi không ấn vào ô input nữa
                            -->
                            <!-- <input
                              :class="'input_' + indexRow + '_' + itemfield.field_name"
                              type="text"
                              @focus="showIconData('button_' + indexRow + '_' + itemfield.field_name, 'close_' + indexRow + '_' + itemfield.field_name)"
                              @blur="closeIconData('button_' + indexRow + '_' + itemfield.field_name)"
                            /> -->

                            <input
                              v-if="itemfield.type == 'Text'"
                              :class="'input_' + indexRow + '_' + itemfield.id"
                              type="text"
                              @focus="
                                showIconData(
                                  'button_' + indexRow + '_' + itemfield.id,
                                  'close_' + indexRow + '_' + itemfield.id
                                )
                              "
                            />
                            <input
                              v-if="itemfield.type == 'Number'"
                              type="number"
                              :class="'input_' + indexRow + '_' + itemfield.id"
                              @focus="
                                showIconData(
                                  'button_' + indexRow + '_' + itemfield.id,
                                  'close_' + indexRow + '_' + itemfield.id
                                )
                              "
                            />

                            <input
                              v-if="
                                itemfield.type == 'Date' ||
                                itemfield.type == 'DateTime'
                              "
                              type="datetime-local"
                              :class="'input_' + indexRow + '_' + itemfield.id"
                              @focus="
                                showIconData(
                                  'button_' + indexRow + '_' + itemfield.id,
                                  'close_' + indexRow + '_' + itemfield.id
                                )
                              "
                            />
                            <!-- Icon chữ V -->
                            <i
                              v-on:click="
                                addDataValue(
                                  itemfield.id,
                                  itemRow.id,
                                  itemfield.type,
                                  'input_' + indexRow + '_' + itemfield.id
                                )
                              "
                              :class="
                                'fa fa-telegram ' +
                                'button_' +
                                indexRow +
                                '_' +
                                itemfield.id
                              "
                              style="display: none"
                              aria-hidden="true"
                            ></i>
                            <i
                              v-on:click="
                                closeIconData(
                                  'button_' + indexRow + '_' + itemfield.id,
                                  'close_' + indexRow + '_' + itemfield.id
                                )
                              "
                              :class="
                                'fa fa-window-close-o ' +
                                'close_' +
                                indexRow +
                                '_' +
                                itemfield.id
                              "
                              style="display: none"
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div>
                        <div v-else>
                          <!-- 
                          "@focus" này là bắt sự kiện khi ấn vào ô input
                          "@blur" này là bắt sự kiện khi không ấn vào ô input nữa
                      -->
                          <input
                            disabled
                            type="text"
                            @focus="showIcon = true"
                            @blur="showIcon = false"
                          />
                          <!-- Icon chữ V -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

  <div v-if="isShowRow" class="loading-overlay">
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
        <input v-model="rowDTO.table_id" type="text" />
        <button v-on:click="addRow">Add</button>
      </div>
      <div>
        <button @click="isShowRow = false">x</button>
      </div>
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

  <div v-if="isLoading" class="loading-overlay">
    <div class="spinner"></div>
    <p>載入中......</p>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, getCurrentInstance, onMounted } from "vue";
import { useCounterStore } from "../../store";
import Swal from "sweetalert2";

const dataProjects = ref([]);
const store = useCounterStore();
const isShowProject = ref(false);

const roleFieldOne = ref({
  id_field: 0,
  id_role: 0,
  can_read: false,
  can_write: false,
});
const dataFieldDTO = ref({
  table_id: 0,
  field_key: "",
  field_name: "",
  fieldType: "",
  field_options: "",
  sort_order: 0,
  listRoles: [],
});

const dataValueDTO = ref({
  row_id: 0,
  field_id: 0,
  field_key: "",
  value_text: "",
  value_number: 0,
  value_date: "2025-10-01T01:43:47.177Z",
  value_datetime: "2025-10-01T01:43:47.177Z",
  valueBoolean: true,
});
const isShowRow = ref(false);
const isShowField = ref(false);
const isShowRowField = ref(false);
// const role = store.getRole(0) || -1;
const role = store.getRoleList();
const showIcon = ref(false);
const ProjectsDTO = ref({
  name: "",
  description: "",
});

const rowDTO = ref({
  table_id: 0,
});
const projectData = ref([]);

const idTable = ref(0);

const listRole = ref([]);

const listUserData = ref([]);

const tableDTO = ref({
  project_id: 0,
  name: "",
  description: "",
});

const role_access_raw = ref({
  table_id: 0,
  user_id: 0,
  role_id: 0,
  type: "",
});

const isShowTable = ref(false);
const isShowRoleTable = ref(false);
const isShowImportFile = ref(false);
const projectDataList = ref([]);

const isLoading = ref(false);
const roleListData = ref([]);

const selectFile = ref(null);

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
const findAllUser = async () => {
  const res = await axios.get(
    hostName + "/api/User/FindAll?page=1&pageSize=2000",
    getToken()
  );
  if (res.data.success) {
    listUserData.value = res.data.content.data;
  }
};
const ShowRoleTable = (id) => {
  role_access_raw.value.table_id = id;
  isShowRoleTable.value = true;
};
const addFieldRole = async () => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";

  const res = await axios.post(
    hostName + "/api/FieldDefinition/AddRole",
    roleFieldOne.value,
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
const ShowRowField = (id) => {
  roleFieldOne.value.id_field = id;
  isShowRowField.value = true;
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
const ShowRow = (id) => {
  // isShowRow.value = true
  rowDTO.value.table_id = id;
  addRow();
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
const addRole = () => {
  listRole.value.push({ role_id: 0, can_read: false, can_write: false });
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
const addDataValue = async (fieldId, rowId, type, dataInput) => {
  const dataValue = document.querySelector("." + dataInput)?.value;
  if (dataValue) {
    if (type === "Number" && dataValue == 0) {
      Swal.fire("Data Number Null");
      return;
    }
    if (type === "Text") dataValueDTO.value.value_text = dataValue;
    else if (type === "Number") dataValueDTO.value.value_number = dataValue;
    else if (type === "date") dataValueDTO.value.value_date = dataValue;
    else if (type === "datetime") dataFieldDTO.value.value_datetime = dataValue;
  } else {
    Swal.fire("Data Null");
    return;
  }

  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";

  dataValueDTO.value.row_id = rowId;
  dataValueDTO.value.field_id = fieldId;

  // if(!checkValueData()){
  //   Swal.fire("Data input null")
  //   return
  // }
  const res = await axios.post(
    hostName + "/api/Data_values_eav/Add",
    dataValueDTO.value,
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

// const checkValueData = () => {
//   if(dataValueDTO.value.value_text === ""
//   || dataValueDTO.value.value_number == 0
//   || dataValueDTO.value.value_date === ""
//   || dataValueDTO.value.value_datetime === "")
//     return false

//   return true

// }
const showIconData = (classData, classData2) => {
  // console.log(classData2)
  // console.log(classData)
  document.querySelector("." + classData).style.display = "block";
  document.querySelector("." + classData2).style.display = "block";
};

const closeIconData = (classData, classData2) => {
  document.querySelector("." + classData).style.display = "none";
  document.querySelector("." + classData2).style.display = "none";
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
const FindAllTableByProject = async (id) => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";

  idTable.value = id;
  const res = await axios.get(
    hostName + `/api/Table/FindOneTable?id=${id}&page=1&pageSize=200000`,
    getToken()
  );
  projectData.value = res.data.content.data;

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
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
    findAllProjects();
  } else {
    Swal.fire("Error");
  }

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
};
const getToken = () => {
  var result = {
    headers: { Authorization: `Bearer ${store.getToken}` },
  };

  return result;
};

const { proxy } = getCurrentInstance();
const hostName = proxy?.hostname;
const findAllProjects = async () => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";

  const res = await axios.get(
    hostName + "/api/projects/FindAll?page=1&pageSize=20000",
    getToken()
  );
  dataProjects.value = res.data.content.data;

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
};

onMounted(() => {
  findAllProjects();
  FindAllProject();
  FindAllRole();
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
