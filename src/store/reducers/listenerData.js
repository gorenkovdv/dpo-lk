const initialState = {
  list: {
    registration: {},
    fact: {},
    passport: {},
    work: {},
    education: {},
    sertificates: {},
    others: {},
  },
  selectedTab: 0,
  documentsTab: 0,
}

export function listenerDataReducer(state = initialState, action) {
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
            levels: state.list.education.levels.map((level) =>
              level
                .map((document) => {
                  return document
                })
                .concat(action.payload)
            ),
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
