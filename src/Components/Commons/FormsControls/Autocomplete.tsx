import React from 'react'
import { Autocomplete as AutocompleteControl } from '@material-ui/lab'
import { parseUserOption } from '../../../utils/parse'
import { IUserOption } from '../../../types'
import { makeStyles } from '@material-ui/core/styles'
import { TextField, CircularProgress } from '@material-ui/core'
import { Check as CheckIcon } from '@material-ui/icons/'


const useStyles = makeStyles((theme) => ({
    option: {
        transform: 'translateZ(0)',
    },
    iconTitle: {
        marginLeft: theme.spacing(1.25),
    },
}))

interface IProps {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
    options: IUserOption[]
    isLoading: boolean
    value: IUserOption | null
    inputValue: string
    setValue: (value: IUserOption) => void
    onInputChange: (event: React.ChangeEvent<{}>, value: string) => void
}

const Autocomplete: React.FC<IProps> = ({
    isOpen,
    onOpen,
    onClose,
    options,
    isLoading,
    value,
    inputValue,
    setValue,
    onInputChange
}) => {
    const classes = useStyles()

    return <AutocompleteControl
        style={{ width: '100%' }}
        open={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        noOptionsText="Список пуст"
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionDisabled={(option) => option.isUserAdded}
        getOptionLabel={parseUserOption}
        options={options}
        loading={isLoading}
        inputValue={inputValue}
        value={value}
        onInputChange={onInputChange}
        onChange={(e: React.ChangeEvent<{}>, value: IUserOption | null) => {
            if (options.length && value) setValue(value)
        }}
        classes={{
            option: classes.option,
            noOptions: classes.option,
        }}
        renderOption={(option) => (
            <>
                <span>{parseUserOption(option)}</span>
                {option.isUserAdded && <CheckIcon className={classes.iconTitle} />}
            </>
        )}
        renderInput={(params) => (
            <TextField
                {...params}
                label="Введите полностью или частично ФИО слушателя"
                InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <>
                            {isLoading ? (
                                <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                        </>
                    ),
                }}
            />
        )}
    />
}

export default Autocomplete