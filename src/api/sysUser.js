import request from '@/utils/request'

const base_api = '/admin/system/sysUser'

// 分页查询用户数据
export const GetSysUserListByPage = (pageNum, pageSize,queryDTO) => {
    return request ({
        url: `${base_api}/findByPage/${pageNum}/${pageSize}`,
        method: 'post',
        data: queryDTO
    })
}

// 添加用户数据
export const SaveSysUser = (data) => {
    return request ({
        url: `${base_api}/saveSysUser`,
        method: 'post',
        data
    })
}

// 修改用户数据
export const UpdateSysUser = (data) => {
    return request ({
        url: `${base_api}/updateSysUser`,
        method: 'put',
        data
    })
}

// 删除用户数据
export const DeleteSysUser = (userId) => {
    return request ({
        url: `${base_api}/deleteSysUserById/${userId}`,
        method: 'delete'
    })
}

// 保存用户与角色关系
export const DoAssignRoleToUser = (assginRoleDTO) => {
    return request ({
        url: `${base_api}/doAssign`,
        method: 'post',
        data: assginRoleDTO
    })
}