import { ChangeEventHandler } from "react"

type Inputtype = {
    placeholder : string,
    className : string,
    onchange : ChangeEventHandler<HTMLInputElement>
}
export const Input = ({placeholder , className , onchange} : Inputtype) => {
    return(
        <div>
        <input type="text" placeholder={placeholder} className={className} onChange={onchange} />
        </div>
    )
}