name: Feature Request
description: Suggest a new feature or improvement
labels: [enhancement]

body:
  - type: markdown
    attributes:
      value: |
        Thank you for suggesting an enhancement! Please provide details below.

  - type: textarea
    id: use-case
    attributes:
      label: Use case / Problem
      description: What problem are you trying to solve?
      placeholder: |
        Example: "We need to integrate with Azure Service Bus for queuing messages..."
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Proposed solution
      description: How would you implement this?
      placeholder: |
        Example: "Add a new endpoint POST /api/queue/message that writes to Service Bus..."
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives considered
      description: What else could work?
      placeholder: |
        - Use Azure Event Grid instead
        - Implement in-memory queue
    validations:
      required: false

  - type: dropdown
    id: version
    attributes:
      label: Which version(s) affected?
      options:
        - V1 (Tab only)
        - V2 (Tab + Message Extension)
        - V3 (Graph API)
        - All versions
    validations:
      required: true

  - type: textarea
    id: context
    attributes:
      label: Additional context
      description: Screenshots, links, or other details?
