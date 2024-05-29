import request from '@/utils/request'

const base_api = '/admin/system/sysRole'

// 分页查询角色数据
export const GetSysRoleListByPage = (pageNum, pageSize, queryDTO) => {
    return request({
        // `` 模板字符串
        url: `${base_api}/findByPage/${pageNum}/${pageSize}`,
        method: 'post',
        // 前端表示用 json 数据传输即通过请求体传输 用 data 参数传输 用 params
        data: queryDTO
    })
}

// 添加角色
export const SaveSysRole = (data) => {
    return request({
        // `` 模板字符串
        url: `${base_api}/saveSysRole`,
        method: 'post',
        // 前端表示用 json 数据传输即通过请求体传输 用 data 参数传输 用 params
        data
    })
}

// 修改角色
export const UpdateSysRole = (data) => {
    return request({
        url: `${base_api}/updateSysRole`,
        method: 'put',
        data
    })
}

// 删除角色
export const DeleteSysRole = (roleId) => {
    return request({
        url: `${base_api}/deleteSysRole/${roleId}`,
        method: 'delete',
    })
}


// 查询所有角色
export const GetAllRoleList = (userId) => {
    return request({
        url: `${base_api}/findAllRoles/${userId}`,
        method: 'get',
    })
}

// 根据角色分配菜单请求方法
export const DoAssignMenuIdToSysRole = (assignMenuDTO) => {
    return request({
        url: `${base_api}/doAssign`,
        method: 'post',
        data: assignMenuDTO
    })
}