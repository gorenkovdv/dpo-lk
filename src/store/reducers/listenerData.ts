import { ThunkAction } from 'redux-thunk'
import { profileAPI, documentAPI } from '../../services/api'
import { actions as snackbarActions } from './snackbar'
import { actions as loaderActions } from './loader'
import { AppStateType, InferActionsType } from './index'
import { IDocument } from '../../types'

interface IPage {
  currentDocument: number,
  documents: Array<IDocument>
}

interface IEducationPage {
  currentDocument: number,
  currentLevel: number,
  fullName: string | null,
  levels: Array<Array<IDocument>>
}

interface IAddress {
  postcode: string
  country: string
  region: string
  locality: string
  localityType: number
  street: string
  house: string
  room?: string
}

interface IWork extends IAddress {
  listenerPosition: string
  accessionDate: string
  hrPhone: string
  workPhone: string
  fileURL: string | null
  newFile?: string | null
}

interface IStateList {
  registration: IAddress
  fact: IAddress
  passport: IPassport
  work: IWork
  education: IEducationPage
  sertificates: IPage
  others: IPage
}

interface IPassport {
  number: string
  series: string
  unitCode: string
  birthPlace: string
  issuedBy: string
  issuedDate: string
}

interface IState {
  selectedTab: number
  documentsTab: number
  list: IStateList
}

type listenerDataActionsTypes = InferActionsType<typeof actions>

const initialState: IState = {
  list: {
    registration: {
      postcode: '',
      country: '',
      region: '',
      locality: '',
      localityType: 0,
      street: '',
      house: '',
      room: '',
    },
    fact: {
      postcode: '',
      country: '',
      region: '',
      locality: '',
      localityType: 0,
      street: '',
      house: '',
      room: '',
    },
    passport: {
      number: '',
      series: '',
      unitCode: '',
      birthPlace: '',
      issuedBy: '',
      issuedDate: '',
    },
    work: {
      postcode: '',
      country: '',
      region: '',
      locality: '',
      localityType: 0,
      street: '',
      house: '',
      room: '',
      listenerPosition: '',
      accessionDate: '',
      hrPhone: '',
      workPhone: '',
      fileURL: null,
    },
    education: {
      currentDocument: 0,
      currentLevel: 0,
      fullName: null,
      levels: []
    },
    sertificates: {
      currentDocument: 0,
      documents: []
    },
    others: {
      currentDocument: 0,
      documents: []
    },
  },
  selectedTab: 0,
  documentsTab: 0,
}

export function listenerDataReducer(state = initialState, action: listenerDataActionsTypes): IState {
  switch (action.type) {
    case 'LISTENER_DATA_LOAD_SUCCESS':
      return {
        ...state,
        list: action.payload,
      }
    case 'LISTENER_DATA_SET_SELECTED_TAB':
      return {
        ...state,
        selectedTab: action.payload,
      }
    case 'LISTENER_DATA_SET_DOCUMENTS_TAB':
      return {
        ...state,
        documentsTab: action.payload,
      }
    case 'LISTENER_DATA_SET_REG_ADDRESS':
      return {
        ...state,
        list: {
          ...state.list,
          registration: action.payload,
        },
      }
    case 'LISTENER_DATA_SET_FACT_ADDRESS':
      return {
        ...state,
        list: {
          ...state.list,
          fact: action.payload,
        },
      }
    case 'LISTENER_DATA_SET_PASSPORT_DATA':
      return {
        ...state,
        list: {
          ...state.list,
          passport: action.payload,
        },
      }
    case 'LISTENER_DATA_SET_WORK_DATA':
      return {
        ...state,
        list: {
          ...state.list,
          work: {
            ...action.payload,
            newFile: null,
          },
        },
      }
    case 'LISTENER_DATA_SET_EDUCATION_DATA':
      return {
        ...state,
        list: {
          ...state.list,
          education: {
            ...state.list.education,
            levels: state.list.education.levels.map((level, levelIndex) =>
              level.map((document, documentIndex) => {
                if (
                  levelIndex === state.list.education.currentLevel &&
                  documentIndex === state.list.education.currentDocument
                )
                  return { ...action.payload, isDocumentNew: false }
                return document
              })
            ),
          },
        },
      }
    case 'LISTENER_DATA_SET_SERTIFICATES_DATA':
      return {
        ...state,
        list: {
          ...state.list,
          sertificates: {
            ...state.list.sertificates,
            documents: state.list.sertificates.documents.map(
              (document, documentIndex) => {
                if (documentIndex === state.list.sertificates.currentDocument)
                  return { ...action.payload, isDocumentNew: false }
                return document
              }
            ),
          },
        },
      }
    case 'LISTENER_DATA_SET_OTHERS_DATA':
      return {
        ...state,
        list: {
          ...state.list,
          others: {
            ...state.list.others,
            documents: state.list.others.documents.map(
              (document, documentIndex) => {
                if (documentIndex === state.list.others.currentDocument)
                  return { ...action.payload, isDocumentNew: false }
                return document
              }
            ),
          },
        },
      }
    case 'LISTENER_DATA_WORK_FILE_DELETED':
      return {
        ...state,
        list: {
          ...state.list,
          work: {
            ...state.list.work,
            fileURL: null,
            newFile: null,
          },
        },
      }
    case 'LISTENER_DATA_CHANGE_EDUCATION_LEVEL':
      return {
        ...state,
        list: {
          ...state.list,
          education: {
            ...state.list.education,
            currentDocument: 0,
            currentLevel: action.payload,
          },
        },
      }
    case 'LISTENER_DATA_CHANGE_EDUCATION_DOCUMENT':
      return {
        ...state,
        list: {
          ...state.list,
          education: {
            ...state.list.education,
            currentDocument: action.payload,
          },
        },
      }
    case 'LISTENER_DATA_CHANGE_SERTIFICATES_DOCUMENT':
      return {
        ...state,
        list: {
          ...state.list,
          sertificates: {
            ...state.list.sertificates,
            currentDocument: action.payload,
          },
        },
      }
    case 'LISTENER_DATA_CHANGE_OTHERS_DOCUMENT':
      return {
        ...state,
        list: {
          ...state.list,
          others: {
            ...state.list.others,
            currentDocument: action.payload,
          },
        },
      }
    case 'LISTENER_DATA_CREATE_NEW_EDUCATION_DOCUMENT':
      return {
        ...state,
        list: {
          ...state.list,
          education: {
            ...state.list.education,
            levels: state.list.education.levels.map((level, index) => {
              if (index !== state.list.education.currentLevel) return level

              return level.concat(action.payload)
            }),
            currentDocument:
              state.list.education.levels[state.list.education.currentLevel]
                .length,
          },
        },
      }
    case 'LISTENER_DATA_CREATE_NEW_SERTIFICATE':
      return {
        ...state,
        list: {
          ...state.list,
          sertificates: {
            ...state.list.sertificates,
            documents: state.list.sertificates.documents
              .map((document) => {
                return document
              })
              .concat(action.payload),
            currentDocument: state.list.sertificates.documents.length,
          },
        },
      }
    case 'LISTENER_DATA_CREATE_NEW_OTHERS_DOCUMENT':
      return {
        ...state,
        list: {
          ...state.list,
          others: {
            ...state.list.others,
            documents: state.list.others.documents
              .map((document) => {
                return document
              })
              .concat(action.payload),
            currentDocument: state.list.others.documents.length,
          },
        },
      }
    case 'LISTENER_DATA_DROP_NEW_EDUCATION_DOCUMENT':
      return {
        ...state,
        list: {
          ...state.list,
          education: {
            ...state.list.education,
            levels: state.list.education.levels.map((level) =>
              level.filter((document) => !document.isDocumentNew)
            ),
          },
        },
      }
    case 'LISTENER_DATA_DROP_NEW_SERTIFICATE':
      return {
        ...state,
        list: {
          ...state.list,
          sertificates: {
            ...state.list.education,
            documents: state.list.sertificates.documents.filter(
              (document) => !document.isDocumentNew
            ),
            currentDocument: action.payload,
          },
        },
      }
    case 'LISTENER_DATA_DROP_NEW_OTHERS_DOCUMENT':
      return {
        ...state,
        list: {
          ...state.list,
          others: {
            ...state.list.others,
            documents: state.list.others.documents.filter(
              (document) => !document.isDocumentNew
            ),
            currentDocument: action.payload,
          },
        },
      }
    case 'LISTENER_DATA_EDUCATION_FILE_DELETED':
      return {
        ...state,
        list: {
          ...state.list,
          education: {
            ...state.list.education,
            levels: state.list.education.levels.map((level) =>
              level.map((document) => {
                return document.id === action.payload
                  ? { ...document, fileURL: null }
                  : document
              })
            ),
          },
        },
      }
    case 'LISTENER_DATA_SERTIFICATE_FILE_DELETED':
      return {
        ...state,
        list: {
          ...state.list,
          sertificates: {
            ...state.list.sertificates,
            documents: state.list.sertificates.documents.map((document) => {
              return document.id === action.payload
                ? { ...document, fileURL: null }
                : document
            }),
          },
        },
      }
    case 'LISTENER_DATA_OTHERS_FILE_DELETED':
      return {
        ...state,
        list: {
          ...state.list,
          others: {
            ...state.list.others,
            documents: state.list.others.documents.map((document) => {
              return document.id === action.payload
                ? { ...document, fileURL: null }
                : document
            }),
          },
        },
      }
    case 'LISTENER_DATA_EDUCATION_DOCUMENT_DELETED':
      return {
        ...state,
        list: {
          ...state.list,
          education: {
            ...state.list.education,
            levels: state.list.education.levels.map((level) =>
              level.filter((document) => document.id !== action.payload)
            ),
            currentDocument: 0,
          },
        },
      }
    case 'LISTENER_DATA_SERTIFICATES_DOCUMENT_DELETED':
      return {
        ...state,
        list: {
          ...state.list,
          sertificates: {
            ...state.list.sertificates,
            documents: state.list.sertificates.documents.filter(
              (document) => document.id !== action.payload
            ),
            currentDocument: 0,
          },
        },
      }
    case 'LISTENER_DATA_OTHERS_DOCUMENT_DELETED':
      return {
        ...state,
        list: {
          ...state.list,
          others: {
            ...state.list.others,
            documents: state.list.others.documents.filter(
              (document) => document.id !== action.payload
            ),
            currentDocument: 0,
          },
        },
      }
    default:
      return state
  }
}

export const requestListenerData = (selectedTab: number): ThunkAction<Promise<void>, AppStateType, unknown, listenerDataActionsTypes> => {
  return async (dispatch) => {
    dispatch(actions.setLoading())

    const response = await profileAPI.getListenerData(selectedTab)

    if (response.data.response) {
      dispatch(actions.listenerDataLoadingSuccess(response.data.output))
      dispatch(actions.loadingSuccess())
    } else dispatch(actions.showMessageAction(response.data.error, 'error'))
  }
}

export const workFileDelete = (): ThunkAction<Promise<void>, AppStateType, unknown, listenerDataActionsTypes> => {
  return async (dispatch) => {
    const response = await documentAPI.deleteWorkFile()

    if (response.data.response) dispatch(actions.workFileDeleted())
    else dispatch(actions.showMessageAction(response.data.error, 'error'))
  }
}

export const updateData = (data: any, type: number): ThunkAction<Promise<void>, AppStateType, unknown, listenerDataActionsTypes> => {
  return async (dispatch) => {
    const response = await profileAPI.setListenerData(data, type)

    if (response.data.response) {
      switch (type) {
        case 0: dispatch(actions.regDataUpdated(response.data.output)); break;
        case 1: dispatch(actions.factDataUpdated(response.data.output)); break;
        case 2: dispatch(actions.passportDataUpdated(response.data.output)); break;
        case 3: dispatch(actions.workDataUpdated(response.data.output)); break;
        case 4: dispatch(actions.educationDataUpdated(response.data.output)); break;
        case 5: dispatch(actions.sertificatesDataUpdated(response.data.output)); break;
        case 6: dispatch(actions.otherDataUpdated(response.data.output)); break;
        default: break;
      }

      dispatch(actions.showMessageAction('Данные успешно обновлены', 'success'))
    } else dispatch(actions.showMessageAction(response.data.error, 'error'))
  }
}

export const setSelectedTabAction = (tab: number): ThunkAction<void, AppStateType, unknown, listenerDataActionsTypes> => (dispatch) => {
  dispatch(actions.setSelectedTab(tab))
}

export const setDocumentsTabAction = (tab: number): ThunkAction<void, AppStateType, unknown, listenerDataActionsTypes> => (dispatch) => {
  dispatch(actions.setDocumentsTab(tab))
}

export const createNewDocumentAction = (document: IDocument, type: number): ThunkAction<void, AppStateType, unknown, listenerDataActionsTypes> => (dispatch) => {
  switch (type) {
    case 4: dispatch(actions.createNewEducationDocument(document))
    case 5: dispatch(actions.createNewSertificate(document))
    case 6: dispatch(actions.createNewOtherDocument(document))
    default: break;
  }
}

export const selectEducationLevelAction = (level: number): ThunkAction<void, AppStateType, unknown, listenerDataActionsTypes> => (dispatch) => {
  dispatch(actions.selectEducationLevel(level))
}

export const selectDocumentAction = (index: number, type: number): ThunkAction<void, AppStateType, unknown, listenerDataActionsTypes> => (dispatch) => {
  switch (type) {
    case 4: dispatch(actions.selectEducationDocument(index))
    case 5: dispatch(actions.selectSertificate(index))
    case 6: dispatch(actions.selectOtherDocument(index))
    default: break;
  }
}

export const dropNewEducationDocumentAction = (): ThunkAction<void, AppStateType, unknown, listenerDataActionsTypes> => (dispatch) => {
  dispatch(actions.dropNewEducationDocument())
}

export const dropNewSertificateAction = (redirectIndex: number): ThunkAction<void, AppStateType, unknown, listenerDataActionsTypes> => (dispatch) => {
  dispatch(actions.dropNewSertificate(redirectIndex))
}

export const dropNewOtherDocumentAction = (redirectIndex: number): ThunkAction<void, AppStateType, unknown, listenerDataActionsTypes> => (dispatch) => {
  dispatch(actions.dropNewOtherDocument(redirectIndex))
}

export const documentDeleteAction = (documentId: number, type: number): ThunkAction<void, AppStateType, unknown, listenerDataActionsTypes> => {
  return async (dispatch) => {
    const response = await documentAPI.deleteDocument(documentId)

    if (response.data.response) {
      switch (type) {
        case 4: dispatch(actions.educationDocumentDeleted(documentId)); break;
        case 5: dispatch(actions.sertificateDocumentDeleted(documentId)); break;
        case 6: dispatch(actions.otherDocumentDeleted(documentId)); break;
        default: break;
      }
      dispatch(snackbarActions.showMessageAction('Документ успешно удалён', 'success'))
    } else dispatch(snackbarActions.showMessageAction(response.data.error, 'error'))
  }
}

export const fileDeleteAction = (documentId: number, type: number): ThunkAction<void, AppStateType, unknown, listenerDataActionsTypes> => {
  return async (dispatch) => {
    const response = await documentAPI.deleteDocumentsFile(documentId)

    if (response.data.response) {
      switch (type) {
        case 4: dispatch(actions.educationFileDeleted(documentId)); break;
        case 5: dispatch(actions.sertificateFileDeleted(documentId)); break;
        case 6: dispatch(actions.otherFileDeleted(documentId)); break;
        default: break;
      }

      dispatch(actions.showMessageAction('Файл успешно удалён', 'success'))
    } else dispatch(actions.showMessageAction(response.data.error, 'error'))
  }
}


const actions = {
  regDataUpdated: (data: IAddress) => ({
    type: 'LISTENER_DATA_SET_REG_ADDRESS',
    payload: data
  } as const),
  factDataUpdated: (data: IAddress) => ({
    type: 'LISTENER_DATA_SET_FACT_ADDRESS',
    payload: data
  } as const),
  passportDataUpdated: (data: IPassport) => ({
    type: 'LISTENER_DATA_SET_PASSPORT_DATA',
    payload: data
  } as const),
  workDataUpdated: (data: IWork) => ({
    type: 'LISTENER_DATA_SET_WORK_DATA',
    payload: data
  } as const),
  educationDataUpdated: (data: IDocument) => ({
    type: 'LISTENER_DATA_SET_EDUCATION_DATA',
    payload: data
  } as const),
  sertificatesDataUpdated: (data: IDocument) => ({
    type: 'LISTENER_DATA_SET_SERTIFICATES_DATA',
    payload: data
  } as const),
  otherDataUpdated: (data: IDocument) => ({
    type: 'LISTENER_DATA_SET_OTHERS_DATA',
    payload: data
  } as const),
  createNewEducationDocument: (document: IDocument) => ({
    type: 'LISTENER_DATA_CREATE_NEW_EDUCATION_DOCUMENT',
    payload: document
  } as const),
  createNewSertificate: (document: IDocument) => ({
    type: 'LISTENER_DATA_CREATE_NEW_SERTIFICATE',
    payload: document
  } as const),
  createNewOtherDocument: (document: IDocument) => ({
    type: 'LISTENER_DATA_CREATE_NEW_OTHERS_DOCUMENT',
    payload: document
  } as const),
  selectEducationDocument: (index: number) => ({
    type: 'LISTENER_DATA_CHANGE_EDUCATION_DOCUMENT',
    payload: index
  } as const),
  selectSertificate: (index: number) => ({
    type: 'LISTENER_DATA_CHANGE_SERTIFICATES_DOCUMENT',
    payload: index
  } as const),
  selectOtherDocument: (index: number) => ({
    type: 'LISTENER_DATA_CHANGE_OTHERS_DOCUMENT',
    payload: index
  } as const),
  educationDocumentDeleted: (documentId: number) => ({
    type: 'LISTENER_DATA_EDUCATION_DOCUMENT_DELETED',
    payload: documentId
  } as const),
  sertificateDocumentDeleted: (documentId: number) => ({
    type: 'LISTENER_DATA_SERTIFICATES_DOCUMENT_DELETED',
    payload: documentId
  } as const),
  otherDocumentDeleted: (documentId: number) => ({
    type: 'LISTENER_DATA_OTHERS_DOCUMENT_DELETED',
    payload: documentId
  } as const),
  educationFileDeleted: (documentId: number) => ({
    type: 'LISTENER_DATA_EDUCATION_FILE_DELETED',
    payload: documentId
  } as const),
  sertificateFileDeleted: (documentId: number) => ({
    type: 'LISTENER_DATA_SERTIFICATE_FILE_DELETED',
    payload: documentId
  } as const),
  otherFileDeleted: (documentId: number) => ({
    type: 'LISTENER_DATA_OTHERS_FILE_DELETED',
    payload: documentId
  } as const),
  dropNewOtherDocument: (redirectIndex: number) => ({
    type: 'LISTENER_DATA_DROP_NEW_OTHERS_DOCUMENT',
    payload: redirectIndex,
  } as const),
  dropNewSertificate: (redirectIndex: number) => ({
    type: 'LISTENER_DATA_DROP_NEW_SERTIFICATE',
    payload: redirectIndex
  } as const),
  selectEducationLevel: (level: number) => ({
    type: 'LISTENER_DATA_CHANGE_EDUCATION_LEVEL',
    payload: level
  } as const),
  dropNewEducationDocument: () => ({
    type: 'LISTENER_DATA_DROP_NEW_EDUCATION_DOCUMENT'
  } as const),
  workFileDeleted: () => ({
    type: 'LISTENER_DATA_WORK_FILE_DELETED'
  } as const),
  listenerDataLoadingSuccess: (data: IStateList) => ({
    type: 'LISTENER_DATA_LOAD_SUCCESS',
    payload: data
  } as const),
  setSelectedTab: (value: number) => ({
    type: 'LISTENER_DATA_SET_SELECTED_TAB',
    payload: value
  } as const),
  setDocumentsTab: (value: number) => ({
    type: 'LISTENER_DATA_SET_DOCUMENTS_TAB',
    payload: value
  } as const),
  ...loaderActions,
  ...snackbarActions
}