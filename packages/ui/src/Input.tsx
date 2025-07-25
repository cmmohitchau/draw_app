import { ChangeEventHandler } from "react"

type Inputtype = {
    placeholder : string,
    className : string,
    onchange : ChangeEventHandler<HTMLInputElement>
    type? : string
}
export const Input = ({placeholder , className , onchange , type = "text"} : Inputtype) => {
    return(
        <div>
        <input type={type} placeholder={placeholder} className={className} onChange={onchange} />
        </div>
    )
}