# dsl-example

# in2cloud DSL Overview

While working with AWS Connect contact flows seems easy at first, as your project grows you will quickly run 
into complexity!
- How do I see change history?
- How can I manage multiple environments effectively?
- How can I reuse common logic? e.g. Log in, set standard options etc
- How can I automate testing?
- How can I store my contact flows in source code and seamlessly deploy it?

These are just some of the questions that our framework can help you manage.

## How do I use it?

The framework consists of the following parts:

1. The contact flow, written in the in2cloud dsl language  
 This is the logic of the contact flow body and where you will spend most of your time working. This would typically 
 be stored in a git repository, and consist of the contact flows and associated tests

2. The in2cloud CLI  
 The CLI will take your contact flow in DSL form and compile it to the AWS Connect language. It can also
 optionally deploy it to your Connect instance


## in2cloud Contact Flow DSL Tutorial

### Setup
The first step is to install the in2cloud DSL

1. [Install and configure AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
2. [Install Node.js (v16 or later) and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
3. Install or update [in2cloud-cli](https://www.npmjs.com/package/@in2cloud/in2cloud-cli) tool: 
>npm i -g @in2cloud/in2cloud-cli@latest

The in2cloud DSL is now ready to use

#### Using the CLI
This repository contains a number of example flows in the `src` folder. To deploy them run the cli command:
>in2cloud-cli deploy src/[flow.json] --key [api-key] --flow [root-flow-id] --region [your AWS Connect region] --instance [your AWS Connect instance]

For example:
>in2cloud-cli deploy src/simple_greeting.json --key DEMO_API_KEY(see below) --flow simple_greeting --region ap-southeast-2 --instance XXXXX-1111-2222-3333-XXXXXXX
The example above should successfully deploy `simple-greeting` flow in your AWS Connect instance

### DEMO API KEY
For testing purposes you can use this free API key: **XGRVeL3LHi2yhuu9eSLMY1NnfxKfiAEX7YMnxQgw**

This key is for demo purposes only, and should not be used for production purposes,
as it can be expired/disabled/revoked at any time without further notice

### Tutorial 1: Greeting the user
In this example we are going to create a flow that will play a greeting to the user.  

**Note:** A completed example of this tutorial is available in: src/simple_greeting.json

1. Create a new file named `simple_greeting.json`
2. To start, we must create the top level `flows` block:
```json
{
  "flows": [
    {
      "id": "simple_greeting"
    }
  ]
}
```
The code above simply creates the first flow object with the id of `simple_greeting`. But it doesn't do anything yet.
3. Add the blocks that contain the logic:
```json
{
  "flows": [
    {
      "id": "simple_greeting",
      "initial": "start",
      "blocks": {
        "start": {
          "type": "TPlay"
        },
        "disconnect": {
          "type": "TDisconnect"
        }
      }
    }
  ]
}
```
In the code above, we have defined two blocks:  `start` and `disconnect`.

To discover the purpose and syntax of these blocks, refer to the documentation: [in2cloud DSL docs](https://github.com/in2cloud/dsl-doc/blob/master/documentation/README.md)

[TPlay:](https://github.com/in2cloud/dsl-doc/blob/master/documentation/tdslroot-definitions-tplay.md) Plays a message to the caller  
[TDisconnect:](https://github.com/in2cloud/dsl-doc/blob/master/documentation/tdslroot-definitions-tdisconnect.md) End the call via disconnection

The documentation lists two additional attributes required for the `start` block:

- message: This string is the text that will be read to the user
- next: The logical name of the next block to execute. In this example we want to terminate the call after the greeting

4. Add the required fields to your flow  
The completed flow is shown below:

```json
{
  "flows": [
    {
      "id": "simple_greeting",
      "initial": "start",
      "blocks": {
        "start": {
          "type": "TPlay",
          "message": "Welcome to simple greeting demo flow",
          "next": "disconnect"
        },
        "disconnect": {
          "type": "TDisconnect"
        }
      }
    }
  ]
}
```

Your flow is now complete.

5. Deploy to AWS Connect via CLI

To test your flow in a real environment, you need to deploy it to AWS Connect. You can use the in2cloud DSL to do that via the following command:
>in2cloud-cli deploy src/simple_greeting.json --key [DEMO_API_KEY] --flow simple_greeting --region ap-southeast-2 --instance XXXXX-1111-2222-3333-XXXXXXX

6. Review your flow in AWS  
Log on to your AWS Connect instance. Navigate to contact flows, and find the new flow named `simple-greeting`. 
Click on the flow and it will show you the design in the browser:
![Image of connect flow](https://photos.smugmug.com/photos/i-pb2qvg5/0/def5c3c1/XL/i-pb2qvg5-XL.png)

You can review the functions of each block and how it corresponds to your DSL code.

7. Call your flow
Once the example has successfully been deployed, call your instance to confirm the message is read back to you!

### Tutorial 2: Menus and selections
In this example we are going to create a flow that will demonstrate how to construct a menu and receive input from 
the user.

**Note:** A completed example of this tutorial is available in: src/simple_menu.json

1. Create a new file named `simple_menu.json`
2. As a first step, create the basic flow structure:
```json
{
 "flows": [
  {
   "id": "simple_menu",
   "initial": "disconnect",
   "blocks": {
    "disconnect": {
     "type": "TDisconnect"
    }
   }
  }
 ]
}
```
The code above simply creates the first flow object with the id of `simple_menu`. When executed it will take the caller
straight to the disconnection stage.

3. Now add the menu block:
```json
{
  "flows": [
    {
      "id": "simple_menu",
      "initial": "start",
      "blocks": {
        "start": {
          "type": "TMenu",
          "message": "Press 1 to repeat, 2 to disconnect",
          "options": {
            "1": "start",
            "2": "disconnect"
          },
          "nomatch": "start",
          "timeout": "disconnect",
          "error": "error"
        },
        "error": {
          "type": "TPlay",
          "message": "Oh no. Unexpected error. Please call later",
          "next": "disconnect"
        },
        "disconnect": {
          "type": "TDisconnect"
        }
      }
    }
  ]
}
```
The menu item in the flow above is named `start`. It has 2 options defined that correspond to the user input. 
The options block lets you assign the next execution block that corresponds to the user input.  
While the user enters `1`, they will be prompted again for their input. As soon as they select `2`, they will be 
disconnected.

For full details of the TMenu block, please refer to the [in2cloud DSL docs](https://github.com/in2cloud/dsl-doc/blob/master/documentation/README.md):  
[TMenu:](https://github.com/in2cloud/dsl-doc/blob/master/documentation/tdslroot-definitions-tmenu.md) Prompt user to make a choice  

5. Deploy to AWS Connect via CLI

To test your flow in a real environment, you need to deploy it to AWS Connect. You can use the in2cloud DSL to do that via the following command:
>in2cloud-cli deploy src/simple_menu.json --key [DEMO_API_KEY] --flow simple_menu --region ap-southeast-2 --instance XXXXX-1111-2222-3333-XXXXXXX

6. Review your flow in AWS  
   Log on to your AWS Connect instance. Navigate to contact flows, and find the new flow named `simple-menu`.  
   Click on the flow and it will show you the design in the browser:  
   ![Image of connect flow](https://photos.smugmug.com/photos/i-44pzP7C/0/7ddf92cd/O/i-44pzP7C.png)


You can review the functions of each block and how it corresponds to your DSL code.

7. Call your flow  
   Once the example has successfully been deployed, call your instance to test the contact flow!


### Tutorial 3: Echo user choice
In this example we are going to create a flow that will receive input from a user, and play it back to them.

**Note:** A completed example of this tutorial is available in: src/simple_echo.json

1. Create a new file named `simple_echo.json`
2. Add the following blocks:
```json
{
 "flows": [
  {
   "id": "simple_echo",
   "initial": "start",
   "blocks": {
    "start": {
     "type": "TPrompt",
     "message": "Please enter any number, then press #",
     "destination": "number",
     "next": "echo",
     "timeout": "disconnect",
     "error": "error"
    },
    "echo": {
     "type": "TPlay",
     "message": "You have entered ${number}",
     "next": "disconnect"
    },
    "error": {
     "type": "TPlay",
     "message": "Oh no. Unexpected error. Please call later",
     "next": "disconnect"
    },
    "disconnect": {
     "type": "TDisconnect"
    }
   }
  }
 ]
}
```
In the code above, there is a new block type: [TPrompt](https://github.com/in2cloud/dsl-doc/blob/master/documentation/tdslroot-definitions-tprompt.md)  
This block will play a message to the user and wait for input. The input will be stored in the variable name specified in
`destination`. In this example, the variable is named `number`.  
After the input has been stored, the flow will move on to the next block named `echo`, which plays the message back to 
the user. Note that the message contains the `number` variable that was saved earlier.  
After the message is played, the flow will disconnect the user.

3. Deploy to AWS Connect via CLI

To test your flow in a real environment, you need to deploy it to AWS Connect. You can use the in2cloud DSL to do that via the following command:
>in2cloud-cli deploy src/simple_echo.json --key [DEMO_API_KEY] --flow simple_echo --region ap-southeast-2 --instance XXXXX-1111-2222-3333-XXXXXXX

4. Review your flow in AWS  
   Log on to your AWS Connect instance. Navigate to contact flows, and find the new flow named `simple-menu`.  
   Click on the flow and it will show you the design in the browser:  
   ![Image of connect flow](https://photos.smugmug.com/photos/i-NnzzQPN/0/cac3cdc7/O/i-NnzzQPN.png)


You can review the functions of each block and how it corresponds to your DSL code.

5. Call your flow  
   Once the example has successfully been deployed, call your instance to test the contact flow!

### Tutorial 4: Reusing blocks with subflows
In this example we are going to demonstrate how to create a flow that can be called by another flow. This allows you
to create reusable blocks of logic that can be reused.

**Note:** A completed example of this tutorial is available in: 
- src/simple_survey.json
- src/simple_subflow_call.json

1. Create a new file named `simple_survey.json`
2. Add the following content:
```json
{
 "flows": [
  {
   "id": "simple_survey",
   "initial": "start",
   "parameters": ["message"],
   "exits": ["success", "error"],
   "blocks": {
    "start": {
     "type": "TPlay",
     "message": "@message",
     "next": "prompt_score"
    },
    "prompt_score": {
     "type": "TMenu",
     "message": "Use numbers 1 to 5 to provide score.",
     "options": {
      "1": "returnSuccess",
      "2": "returnSuccess",
      "3": "returnSuccess",
     },
     "timeout": "start",
     "nomatch": "start",
     "error": "returnError"
    },
    "returnSuccess": {
     "type": "TReturn",
     "to": "success"
    },
    "returnError": {
     "type": "TReturn",
     "to": "error"
    }
   }
  }
 ]
}
```
The flow above is a simple example to give a survey to the user for them to rate the service - this may be something
you wish all customers to complete after any call.  
Take note of the `parameters` item - it is a list of variables passed in to the flow by the calling flow.  
In the next step we will define the flow that makes use of the survey above.

3. Create a new file named `simple_subflow_call.json`
4. Add the following content:
```json
{
  "flows": [
    {
      "id": "subflow_call",
      "initial": "start",
      "blocks": {
        "start": {
          "type": "TPlay",
          "message": "Welcome to parent flow",
          "next": "survey"
        },
        "survey": {
          "type": "TCall",
          "collection": "simple_survey",
          "callError": "error",
          "message": "This is subflow. Please rate your experience on this call",
          "success": "finish",
          "error": "error"
        },
        "finish": {
          "type": "TPlay",
          "message": "This is parent flow. Thank you for calling. Goodbye",
          "next": "disconnect"
        },
        "error": {
          "type": "TPlay",
          "message": "Oh no. Unexpected error. Please call later",
          "next": "disconnect"
        },
        "disconnect": {
          "type": "TDisconnect"
        }
      }
    }
  ]
}
```
The flow above is the referred to as the `parent`, as it makes use of the shared `subflow`.  
The example above is very simple, it uses 
[TPlay](https://github.com/in2cloud/dsl-doc/blob/master/documentation/tdslroot-definitions-tplay.md) blocks to play
a message to the user, before invoking the survey with a custom message.  
When the subflow is completed, it will play back another message then terminate the call.

5. Deploy to AWS Connect via CLI

Since this flow consists of two files, you will need to include both of them in the deployment command:  
>in2cloud-cli deploy src/simple_subflow_call.json src/simple_survey.json --key [DEMO_API_KEY] --flow subflow_call --region ap-southeast-2 --instance XXXXX-1111-2222-3333-XXXXXXX

6. Review your flow in AWS  
   Log on to your AWS Connect instance. Navigate to contact flows, and find the new flow named `simple-menu`.  
   Click on the flow and it will show you the design in the browser:  
   ![Image of connect flow](https://photos.smugmug.com/photos/i-mSp8hnx/0/287b5e2b/X2/i-mSp8hnx-X2.png)
   
You can review the functions of each block and how it corresponds to your DSL code.

7. Call your flow  
   Once the example has successfully been deployed, call your instance to test the contact flow!


### Tutorial 5: Lambda invocation (TODO add example flow)
TODO

### Tutorial 6: Combining elements in a larger flow (TODO add example flow)
TODO


