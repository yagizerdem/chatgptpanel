import React, { Component } from "react"; // import from react
import { Window, App, Button, TextInput, View, Text } from "proton-native"; // import the proton-native components
require("dotenv").config();
import OpenAI from "openai";
const openai = new OpenAI();

export default class Example extends Component {
  constructor() {
    super();
  }
  state = {
    aiResponse: "",
    prompt: "",
  };

  streamResponse = async (prompt) => {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });
    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || "");
      this.setState((prev) => {
        const aiResponse =
          prev.aiResponse + (chunk.choices[0]?.delta?.content || "");
        return {
          aiResponse: aiResponse,
        };
      });
    }
  };

  onPress = () => {
    console.log("click", this.state);
    this.streamResponse(this.state.prompt);
  };
  handleInputChange = (text) => {
    this.setState({ prompt: text });
  };

  addLineBreaks = (text, maxCharsPerLine) => {
    const regex = new RegExp(`.{1,${maxCharsPerLine}}`, "g");
    return text.match(regex)?.join("\n") || text;
  };
  multilineText = `afaf afa
  afafafaf`;

  render() {
    // all Components must have a render method
    return (
      <App>
        <Window
          style={{
            width: 700,
            height: 450,
            background: "#111111",
          }}
        >
          <View
            style={{
              width: 675,
              height: 400,
              background: "#1e1e1e",
              "margin-left": 25,
              "margin-top": 25,
              "margin-bottom": 25,
            }}
          >
            {this.state.aiResponse.split("\n").map((line, index) => (
              <Text
                key={index}
                style={{ color: "white", lineHeight: 8, fontSize: 8 }}
              >
                {line || "\u00A0"}
              </Text> // Render a space if the line is empty
            ))}
          </View>
          <TextInput
            style={{
              color: "white",
              background: "white",
              width: 500,
              height: 20,
              position: "relative",
              left: 25,
              color: "black",
            }}
            onChangeText={(text) => this.handleInputChange(text)}
          ></TextInput>
          <Button
            title="send"
            style={{
              color: "white",
              background: "white",
              width: 120,
              height: 20,
              position: "relative",
              left: 550,
              top: -20,
              color: "black",
            }}
            onPress={this.onPress}
          ></Button>
        </Window>
      </App>
    );
  }
}
