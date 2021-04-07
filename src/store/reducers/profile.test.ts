import { actions, IState, profileReducer, requestProfile } from "./profile";
import { profileAPI } from '../../services/api'

const stateList = {
    lastname: 'Горенков',
    firstname: 'Дмитрий',
    middlename: 'Вячеславович',
    birthdate: '1995-12-27',
    snils: '11111111111',
    phone: '89635185927',
    email: 'gorenkov@agmu.ru'
}

let state: IState;

const result = {
    status: 200,
    statusText: '',
    headers: {},
    config: {},
    data: {
        response: 1,
        profile: stateList,
        error: null
    }
}

jest.mock('../../services/api')
const profileAPIMock = profileAPI as jest.Mocked<typeof profileAPI>

const dispatchMock = jest.fn()
const getStateMock = jest.fn()

beforeEach(() => {
    state = {
        list: stateList,
    }

    dispatchMock.mockClear()
    getStateMock.mockClear()
})

describe("profile reducer", () => {
    test("UPDATE_SUCCESS", () => {
        const newState = profileReducer(state, actions.updatingSuccess(state.list))

        expect(newState.list).toMatchObject(state.list)
    })
})


describe("profile thunk", () => {
    test("success requestProfile", async () => {
        profileAPIMock.getProfile.mockReturnValue(Promise.resolve(result))

        const thunk = requestProfile()
        await thunk(dispatchMock, getStateMock, {})

        expect(dispatchMock).toBeCalledTimes(3)
        expect(dispatchMock).toHaveBeenNthCalledWith(1, actions.setLoading())
        expect(dispatchMock).toHaveBeenNthCalledWith(2, actions.updatingSuccess(state.list))
        expect(dispatchMock).toHaveBeenNthCalledWith(3, actions.loadingSuccess())
    })
})