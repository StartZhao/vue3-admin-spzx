<template>
  <!---搜索表单-->
  <div class="search-div">
    <el-form label-width="70px" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item label="关键字">
            <el-input
              style="width: 100%"
              placeholder="用户名"
              v-model="queryDTO.keyword"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="createTimes"
              type="daterange"
              range-separator="To"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display: flex">
        <el-button type="primary" size="small" @click="searchSysUser">
          搜索
        </el-button>
        <el-button size="small" @click="resetData">重置</el-button>
      </el-row>
    </el-form>
  </div>

  <!--添加按钮-->
  <div class="tools-div">
    <el-button type="success" size="small" @click="addShow">添 加</el-button>
  </div>
  <!-- 添加对话框 -->
  <el-dialog v-model="dialogVisible" title="添加或修改" width="40%">
    <el-form label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="sysUser.userName" />
      </el-form-item>
      <el-form-item v-if="sysUser.id == null" label="密码">
        <el-input type="password" show-password v-model="sysUser.password" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="sysUser.name" />
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="sysUser.phone" />
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8501/admin/system/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :headers="headers"
        >
          <img v-if="sysUser.avatar" :src="sysUser.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="sysUser.description" />
      </el-form-item>
      <el-form-item label="状态" v-show="radioVisible">
        <el-radio-group v-model="sysUser.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!---数据表格-->
  <el-table :data="list" style="width: 100%">
    <el-table-column prop="userName" label="用户名" />
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="phone" label="手机" />
    <el-table-column prop="avatar" label="头像" #default="scope">
      <img :src="scope.row.avatar" width="50" />
    </el-table-column>
    <el-table-column prop="description" label="描述" />
    <el-table-column prop="status" label="状态" #default="scope">
      {{ scope.row.status == 1 ? '启用' : '禁用' }}
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" />
    <el-table-column label="操作" align="center" width="280" #default="scope">
      <el-button type="primary" size="small" @click="editShow(scope.row)">
        修改
      </el-button>
      <el-button type="danger" size="small" @click="deleteById(scope.row)">
        删除
      </el-button>
      <el-button type="warning" size="small" @click="showAssignRole(scope.row)">
        分配角色
      </el-button>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogRoleVisible" title="分配角色" width="40%">
    <el-form label-width="80px">
      <el-form-item label="用户名">
        <el-input disabled :value="sysUser.userName"></el-input>
      </el-form-item>

      <el-form-item label="角色列表">
        <el-checkbox-group v-model="userRoleIds">
          <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">
            {{ role.roleName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="doAssign">提交</el-button>
        <el-button @click="dialogRoleVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-pagination
    v-model:current-page="pageParams.page"
    v-model:page-size="pageParams.pageSize"
    :page-sizes="[1, 2, 5, 10]"
    @size-change="fetchData"
    @current-change="fetchData"
    layout="total, sizes, prev, pager, next"
    :total="total"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  GetSysUserListByPage,
  SaveSysUser,
  UpdateSysUser,
  DeleteSysUser,
  DoAssignRoleToUser,
} from '@/api/sysUser'
import { GetAllRoleList } from '@/api/sysRole'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useApp } from '@/pinia/modules/app'

/** 分配角色 */
const userRoleIds = ref([])
const allRoles = ref([
  { id: 1, roleName: '管理员' },
  { id: 2, roleName: '业务人员' },
  { id: 3, roleName: '商品录入员' },
])
const dialogRoleVisible = ref(false)
const showAssignRole = async row => {
  sysUser.value = { ...row }
  dialogRoleVisible.value = true
  const { data } = await GetAllRoleList(row.id)
  allRoles.value = data.allRoleList
  userRoleIds.value = data.userRoleIds
}
const doAssign = async () => {
  let assginRoleDTO = {
    userId: sysUser.value.id,
    roleIdList: userRoleIds.value,
  }
  const { code, message } = await DoAssignRoleToUser(assginRoleDTO)
  if (code === 200) {
    ElMessage.success('分配角色成功')
    dialogRoleVisible.value = false
    sysUser.value = { ...defaultForm }
    userRoleIds.value = []
    window.location.reload()
  } else {
    ElMessage.error(message)
  }
}

/** 头像上传 */
const headers = {
  token: useApp().authorization.token, // 从pinia中获取token，在进行文件上传的时候将token设置到请求头中
}
// 图像上传成功以后的事件处理函数
const handleAvatarSuccess = (response, uploadFile) => {
  sysUser.value.avatar = response.data
}
/** 删除用户 */
const deleteById = row => {
  ElMessageBox.confirm(
    '此操作之后，该用户信息将永远消失，是否继续',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    const { code } = await DeleteSysUser(row.id)
    if (code === 200) {
      ElMessage.success('删除成功')
      pageParams.value.page = 1
      fetchData()
    } else {
      ElMessage.error('删除失败')
    }
  })
}

/* 修改用户 */
const editShow = row => {
  sysUser.value = { ...row }
  dialogVisible.value = true
  radioVisible.value = true
}

/* 添加用户 */

const dialogVisible = ref(false)
const radioVisible = ref(false)
const addShow = () => {
  sysUser.value = {...defaultForm}
  dialogVisible.value = true
  radioVisible.value = false
}

// 定义提交表单数据模型
const defaultForm = {
  userName: '',
  name: '',
  phone: '',
  password: '',
  description: '',
  avatar: '',
}
const sysUser = ref({ ...defaultForm })

const submit = async () => {
  if (!sysUser.value.id) {
    const { code, message } = await SaveSysUser(sysUser.value)
    if (code === 200) {
      ElMessage.success('添加成功')
      dialogVisible.value = false
      sysUser.value = { ...defaultForm }
      fetchData()
    } else {
      ElMessage.error(message)
    }
  } else {
    const { code, message } = await UpdateSysUser(sysUser.value)
    if (code === 200) {
      ElMessage.success('修改成功')
      dialogVisible.value = false
      sysUser.value = { ...defaultForm }
      fetchData()
    } else {
      ElMessage.error(message)
    }
  }
}

/* 查询用户 */

// 表格数据模型
const list = ref([])
// 分页条数据模型
const total = ref(0)
// 分页数据
const pageParamsForm = {
  page: 1,
  pageSize: 1,
}
const pageParams = ref(pageParamsForm)

const createTimes = ref([])
const queryDTO = ref({
  keyword: '',
  createTimeBegin: '',
  createTimeEnd: '',
})

const sysUserDTO = ref({ ...queryDTO.value })

// 钩子函数
onMounted(() => {
  fetchData()
})

// 搜索用户数据
const searchSysUser = () => {
  fetchData()
}
// 重置搜索
const resetData = () => {
  sysUserDTO.value = { ...queryDTO.value }
  createTimes.value = []
}

// 分页查询方法
const fetchData = async () => {
  if (createTimes.value.length == 2) {
    sysUserDTO.value.createTimeBegin = createTimes.value[0]
    sysUserDTO.value.createTimeEnd = createTimes.value[1]
  }
  const { code, message, data } = await GetSysUserListByPage(
    pageParams.value.page,
    pageParams.value.pageSize,
    sysUserDTO.value
  )
  list.value = data.records
  total.value = data.total
}
</script>

<style scoped>
.search-div {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>