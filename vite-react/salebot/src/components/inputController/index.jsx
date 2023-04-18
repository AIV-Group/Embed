import React from 'react';
import { Controller } from 'react-hook-form';
const InputController = ({ name, control, required, errors, ...props }) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: required,
            }}
            render={({ field }) => (
                <input
                    className="w-full h-10 pl-4 transition-all ease-in-out border rounded-md outline-none duration-400 focus:ring-1"
                    style={{
                        borderColor: errors?.[name] && 'errors',
                        boxShadow: errors?.[name] && 'rgb(229, 62, 62) 0px 0px 0px 1px',
                    }}
                    type="text"
                    {...props}
                    {...field}
                />
            )}
        />
    );
};

export default InputController;
