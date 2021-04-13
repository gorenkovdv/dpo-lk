import axios from 'axios'
import qs from 'qs'
import { ICourseFilters } from '../types'

const instance = axios.create({
  baseURL: 'http://localhost/scripts/',
  //baseURL: 'https://dpo.asmu.ru/scripts/',
  timeout: 10000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
})

export const userAPI = {
  getUserName() {
    return sessionStorage.username
  },

  getUID() {
    return sessionStorage.uid
  },

  getGroup() {
    return parseInt(sessionStorage.group)
  },
}

export const authAPI = {
  async login(username: string, password: string) {
    return await instance.post(
      `login.php`,
      qs.stringify({ username, password })
    )
  },

  async addUser(profile: any) {
    return await instance.post(`registration.php`, qs.stringify(profile))
  },

  async findUser(value: string) {
    return await instance.get(`find_user.php?value=${value}`)
  },

  async changePassword(id: string, key: string, password: string) {
    return await instance.post(
      `change_password.php`,
      qs.stringify({ id, password, key })
    )
  },

  async checkParams(id: string, key: string) {
    return await instance.get(`check_params.php?id=${id}&key=${key}`)
  },

  setToken(token: any) {
    sessionStorage.setItem('token', JSON.stringify(token))
  },

  setData(data: any) {
    sessionStorage.setItem('uid', data.uid)
    sessionStorage.setItem('access', data.response)
    sessionStorage.setItem('username', data.username)
    this.setToken(data.token)
  },

  clearData() {
    sessionStorage.clear()
  },

  async checkAuth() {
    let tokenData = JSON.parse(sessionStorage.token)

    return await instance.post(
      `login.php`,
      qs.stringify({
        username: userAPI.getUserName(),
        refreshKey: tokenData.secondKey,
      })
    )
  },

  async logout() {
    return await instance.post(
      `logout.php`,
      qs.stringify({ username: userAPI.getUserName(), logout: 1 })
    )
  },

  loggedIn() {
    if (sessionStorage.token == null) return false

    let parseToken = JSON.parse(sessionStorage.token)
    //let timeLeft = (parseToken.expires * 1000 - Date.now()) / 1000

    //console.log(timeLeft)

    return (
      sessionStorage.access &&
      parseToken.expires * 1000 > Date.now() &&
      parseToken.isPasswordSet
    )
  },
}

export const profileAPI = {
  async getProfile() {
    return await instance.get(`get_profile.php?uid=${userAPI.getUID()}`)
  },

  async setProfile(profile: any) {
    return await instance.put(
      `set_profile.php`,
      qs.stringify({ ...profile, uid: userAPI.getUID() })
    )
  },

  async getListenerData(tab: number) {
    return await instance.get(
      `get_listener_data.php?uid=${userAPI.getUID()}&tab=${tab}`
    )
  },

  async setListenerData(data: any, block: number) {
    return await instance.put(
      `set_listener_data.php`,
      qs.stringify({ ...data, uid: userAPI.getUID(), block })
    )
  },
}

export const entityAPI = {
  async getEntityData() {
    return await instance.get(`get_entity_data.php?uid=${userAPI.getUID()}`)
  },

  async setEntityData(data: any) {
    let entity = 1
    return await instance.put(
      `set_entity_data.php`,
      qs.stringify({ ...data, uid: userAPI.getUID(), entity })
    )
  },

  async checkEntityRoots() {
    return await instance.get(`check_entity_roots.php?uid=${userAPI.getUID()}`)
  },

  async addEntityRepresentative(ITN: string) {
    return await instance.post(
      `add_entity_representative.php`,
      qs.stringify({ uid: userAPI.getUID(), ITN })
    )
  },
}

export const documentAPI = {
  async deleteDocument(docId: number) {
    return await instance.delete('delete_document.php', {
      data: qs.stringify({
        id: docId,
        type: 'document',
        block: 'documents',
        uid: userAPI.getUID(),
      }),
    })
  },

  async deleteDocumentsFile(docId: number) {
    return await instance.delete('delete_document.php', {
      data: qs.stringify({
        id: docId,
        type: 'file',
        block: 'documents',
        uid: userAPI.getUID(),
      }),
    })
  },

  async deleteWorkFile() {
    return await instance.delete('delete_document.php', {
      data: qs.stringify({
        block: 'work',
        uid: userAPI.getUID(),
      }),
    })
  },
}

export const coursesAPI = {
  async getCoursesList(page: number, count: number, filters: ICourseFilters) {
    return await instance.post(
      `get_courses_list.php`,
      qs.stringify({ uid: userAPI.getUID(), page, count, filters })
    )
  },
  async getListenerInfo(userId: number) {
    return await instance.get(`get_listener_info.php?uid=${userId}`)
  },

  async saveCheckData(userID: number, rowID: number, data: any) {
    return await instance.post(
      `save_check_data.php`,
      qs.stringify({ userID, rowID, data })
    )
  },
  async getListenersOptions(value: string) {
    return await instance.get(`get_listeners_options.php?value=${value}`)
  },

  async createListenersRequests(courseID: number, listeners: number[]) {
    return await instance.post(
      `create_request.php`,
      qs.stringify({
        listeners: JSON.stringify(listeners),
        courseID,
        contractor: userAPI.getUID()
      })
    )
  },
  async addNewListener(values: any) {
    return await instance.post(`add_new_listener.php`, qs.stringify(values))
  },
}

export const requestsAPI = {
  async getRequests() {
    return await instance.get(`get_requests_list.php?uid=${userAPI.getUID()}`)
  },

  async createRequest(courseID: number) {
    let uid = parseInt(userAPI.getUID())
    return await instance.post(
      `create_request.php`,
      qs.stringify({
        listeners: JSON.stringify([uid]),
        courseID,
      })
    )
  },

  async cancelRequest(requestID: number) {
    return await instance.post(
      `cancel_request.php`,
      qs.stringify({
        requestID,
      })
    )
  },

  async removeRequestUser(rowID: number) {
    return await instance.post(
      `cancel_request.php`,
      qs.stringify({
        rowID,
      })
    )
  },

  async updateCMERequest(data: any) {
    return await instance.post(`update_CME_request.php`, qs.stringify(data))
  },

  async setDocumentsApprove(requestID: number, status: number) {
    return await instance.post(
      `request_documents_approve.php`,
      qs.stringify({
        requestID,
        status,
      })
    )
  },
}
