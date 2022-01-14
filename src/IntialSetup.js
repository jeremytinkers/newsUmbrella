// import { useHistory } from "react-router-dom";
import { useState } from "react";
import { Button, Form, Select } from "semantic-ui-react";

var name = "";
var preference = "";

export default function IntialSetup(props) {
  // let history = useHistory();

  const countryOptions = [
    { key: "tech", value: "tech", text: "Tech" },
    { key: "gen", value: "general", text: "General" },
    { key: "loc", value: "local", text: "Local" },
    { key: "fin", value: "finance", text: "Finance" },
    // { key: "rand", value: "random", text: "Random" },
  ];

  function handlePref(e, data) {
    preference = data.value;
  }

  function handleName(e) {
    name = e.target.value;
  }

  const [loading, setLoading] = useState(false);

  function stallFn() {
    setLoading(false);
    props.changePreference(preference);
    props.changeSetup(true);
  }

  function submitInitials() {
    //store in localStorage
    setLoading(true);
    try {
      localStorage.setItem("name", name);
      localStorage.setItem("preference", preference);
      setTimeout(stallFn, 1000);
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  }

  return (
    <div className="intialForm">
      <Form>
        <Form.Field>
          <label>Name</label>
          <input onChange={handleName} placeholder="First Name" />
        </Form.Field>
        <Form.Field>
          <label>Preference</label>
          <Select
            onChange={handlePref}
            placeholder="Select your preference"
            options={countryOptions}
          />
        </Form.Field>
        <Button secondary loading={loading} onClick={submitInitials}>
          Submit
        </Button>
      </Form>
    </div>
  );
}
