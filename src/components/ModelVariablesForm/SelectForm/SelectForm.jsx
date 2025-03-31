export const SelectForm = ({ options, placeholder, label, name, register, form, values=[0] }) => {
	return (
		<>
			{label != undefined ? <label>{label}</label> : <></>}
			<select {...form.register(name, register)} defaultValue={""} name={name}>
				<option disabled value="">{placeholder}</option>
				{options.map((option, i) => {
					return <option key={option} value={values[i]}>{option}</option>
				})}
			</select>
		</>
	)
}