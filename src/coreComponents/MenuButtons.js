import { Button } from "semantic-ui-react";

export default function MenuButtons1(props) {
  return (
    <div>
      <div className="menuButtons">
        <Button
          color="black"
          content="Local"
          label={{
            basic: true,
            color: "black",
            pointing: "left",
            content: props.localSize,
          }}
          onClick={() => props.selectDomainNews}
        />
        <Button
          color="black"
          content="General"
          label={{
            basic: true,
            color: "black",
            pointing: "left",
            content: props.generalSize,
          }}
        />

        <Button
          color="black"
          content="Tech"
          label={{
            basic: true,
            color: "black",
            pointing: "left",
            content: props.techSize,
          }}
        />
        <Button
          color="black"
          content="Finance"
          label={{
            basic: true,
            color: "black",
            pointing: "left",
            content: props.financeSize,
          }}
        />
      </div>
    </div>
  );
}
