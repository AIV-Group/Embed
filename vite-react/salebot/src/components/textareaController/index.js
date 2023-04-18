import React from 'react';
import { Controller } from 'react-hook-form';
const TextAreaController = ({ name, control, required, defaults, onkeyUpValue, errors, ...props }) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: required,
            }}
            render={({ field }) => (
                <textarea
                    className="w-full pl-4 pt-2 transition-all ease-in-out border sm:h-[200px] h-[150px] rounded-md outline-none duration-400 focus:ring-1"
                    onkeyUp={(e) => onkeyUpValue(e.target.value)}
                    style={{
                        borderColor: errors?.[name] && 'errors',
                        boxShadow: errors?.[name] && 'rgb(229, 62, 62) 0px 0px 0px 1px',
                    }}
                    {...props}
                    {...field}
                />
            )}
        />
    );
};

export default TextAreaController;
