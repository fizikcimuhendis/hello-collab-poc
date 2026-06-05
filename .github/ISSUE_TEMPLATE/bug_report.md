name: Bug Report
description: Report a bug in HelloCollab
labels: [bug]

body:
  - type: markdown
    attributes:
      value: |
        Thank you for reporting a bug! Please fill out the details below.

  - type: textarea
    id: description
    attributes:
      label: Describe the bug
      description: What is the problem?
      placeholder: |
        Example: "When I run npm start:v3, the app crashes with..."
    validations:
      required: true

  - type: textarea
    id: reproduction
    attributes:
      label: Steps to reproduce
      description: How do you trigger the bug?
      placeholder: |
        1. Run `npm install`
        2. Set environment variables in `.env`
        3. Run `npm start:v3`
        4. Visit http://localhost:3000
        5. Click on X...
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Expected behavior
      description: What should happen?
    validations:
      required: true

  - type: textarea
    id: actual
    attributes:
      label: Actual behavior
      description: What actually happens?
    validations:
      required: true

  - type: dropdown
    id: version
    attributes:
      label: Version affected
      options:
        - V1 (Tab only)
        - V2 (Tab + Message Extension)
        - V3 (Graph API)
        - All versions
    validations:
      required: true

  - type: input
    id: node-version
    attributes:
      label: Node.js version
      description: Output of `node --version`
      placeholder: v20.0.0
    validations:
      required: true

  - type: input
    id: os
    attributes:
      label: Operating System
      placeholder: Windows 11, macOS Ventura, Ubuntu 22.04
    validations:
      required: true

  - type: textarea
    id: error
    attributes:
      label: Error message or stack trace
      description: Paste any error messages or logs
      render: shell

  - type: textarea
    id: context
    attributes:
      label: Additional context
      description: Any other relevant information?
