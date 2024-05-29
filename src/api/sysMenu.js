import request from '@/utils/request'

const api_name = '/admin/system/sysMenu'
// 分页列表
export const FindNodes = () => {
    return request({
        url: `${api_name}/findNodes`,
        method: 'get',
    })
}

// 保存信息
export const SaveMenu = sysMenu => {
    return request({
        url: `${api_name}/saveSysMenu`,
        method: 'post',
        data: sysMenu,
    })
}

// 修改信息
export const UpdateSysMenuById = sysMenu => {
    return request({
        url: `${api_name}/updateById`,
        method: 'put',
        data: sysMenu,
    })
}

// 根据id删除数据
export const RemoveSysMenuById = id => {
    return request({
        url: `${api_name}/removeById/${id}`,
        method: 'delete',
    })
}

// 查询指定角色所对应的菜单id
export const GetSysRoleMenuIds = (roleId) => {
    return request({
        url: `${api_name}/findSysRoleMenuByRoleId/${roleId}`,
        method: 'get'
    })
}