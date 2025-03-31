export const InputForm = ({ name, type, register, label, placeholder, form, value }) => {
	return (
		<>
			<label>{label}</label>
			<input 
				{...form.register(name, register)}
				name={name}
				placeholder={placeholder}
				type={type}
				value={value}
			></input>
			{form.errors[name] && (<span className="validationError">{form.errors[name].message}</span>)}
		</>
	)
}