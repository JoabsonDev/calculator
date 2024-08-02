class Calculator {
  constructor() {
    this.display = document.getElementById("display")
    this.memory = 0
    this.currentOperation = null
    this.resetDisplay = false
    this.memoryRecall = false
    this.initialize()
  }

  initialize() {
    this.attachButtonEvents()
    this.attachKeyboardEvents()
  }

  attachButtonEvents() {
    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.getAttribute("data-action")
        this.processAction(action)
        this.addBlinkAnimation()
      })
    })
    this.display.addEventListener("animationend", () =>
      this.display.classList.remove("animate-blink")
    )
  }

  attachKeyboardEvents() {
    document.addEventListener("keydown", (event) => {
      this.processKeyboard(event)
      this.addBlinkAnimation()
    })
  }

  processAction(action) {
    if (isFinite(action)) {
      this.handleNumber(action)
    } else if (action === ".") {
      this.handleDecimal()
    } else {
      this.handleOperation(action)
    }
  }

  processKeyboard(event) {
    const keyActions = {
      0: () => this.handleNumber("0"),
      1: () => this.handleNumber("1"),
      2: () => this.handleNumber("2"),
      3: () => this.handleNumber("3"),
      4: () => this.handleNumber("4"),
      5: () => this.handleNumber("5"),
      6: () => this.handleNumber("6"),
      7: () => this.handleNumber("7"),
      8: () => this.handleNumber("8"),
      9: () => this.handleNumber("9"),
      ".": () => this.handleDecimal(),
      "+": () => this.handleOperation("+"),
      "-": () => this.handleOperation("-"),
      "*": () => this.handleOperation("*"),
      "/": () => this.handleOperation("/"),
      Enter: () => this.handleOperation("="),
      Escape: () => this.resetCalculator(),
      m: () => {
        if (event.ctrlKey) this.memoryRecallClear()
      },
      M: () => {
        if (event.shiftKey) this.memoryAdd()
      },
      N: () => {
        if (event.shiftKey) this.memorySubtract()
      }
    }

    const action = keyActions[event.key]
    if (action) action()
  }

  handleNumber(number) {
    if (this.resetDisplay || this.display.value === "0" || this.memoryRecall) {
      this.display.value = number
      this.resetDisplay = false
      this.memoryRecall = false
    } else {
      this.display.value += number
    }
  }

  handleDecimal() {
    if (this.resetDisplay) {
      this.display.value = "0."
      this.resetDisplay = false
    } else if (!this.display.value.includes(".")) {
      this.display.value += "."
    }
    this.memoryRecall = false
  }

  handleOperation(action) {
    const operations = {
      "on-ce": () => this.resetCalculator(),
      off: () => this.turnOff(),
      mrc: () => this.memoryRecallClear(),
      "m-plus": () => this.memoryAdd(),
      "m-minus": () => this.memorySubtract(),
      "√": () =>
        (this.display.value = Math.sqrt(parseFloat(this.display.value))),
      "%": () => (this.display.value = parseFloat(this.display.value) / 100),
      "=": () => this.calculate()
    }

    if (["/", "*", "-", "+"].includes(action)) {
      this.handleMathOperation(action)
    } else {
      const operation = operations[action]
      if (operation) operation()
    }
  }

  handleMathOperation(operation) {
    if (this.currentOperation && !this.resetDisplay) {
      this.calculate()
    }
    this.currentOperation = operation
    this.memory = parseFloat(this.display.value)
    this.resetDisplay = true
  }

  calculate() {
    if (!this.currentOperation) return

    const operations = {
      "/": (a, b) => a / b,
      "*": (a, b) => a * b,
      "-": (a, b) => a - b,
      "+": (a, b) => a + b
    }

    const result = operations[this.currentOperation](
      this.memory,
      parseFloat(this.display.value)
    )
    this.display.value = result
    this.currentOperation = null
    this.resetDisplay = true
  }

  resetCalculator() {
    this.display.value = "0"
    this.memory = 0
    this.currentOperation = null
    this.display.placeholder = "0"
    this.toggleButtons(false)
    document.getElementById("m").classList.add("hidden")
  }

  turnOff() {
    this.display.value = ""
    this.display.placeholder = ""
    this.toggleButtons(true)
  }

  memoryRecallClear() {
    if (this.memoryRecall) {
      this.memory = 0
      this.memoryRecall = false
      this.display.value = "0"
      document.getElementById("m").classList.add("hidden")
    } else {
      this.display.value = this.memory
      this.memoryRecall = true
      document.getElementById("m").classList.remove("hidden")
    }
  }

  memoryAdd() {
    this.memory += parseFloat(this.display.value)
    this.resetDisplay = true
    this.updateMemoryIndicator()
  }

  memorySubtract() {
    this.memory -= parseFloat(this.display.value)
    this.resetDisplay = true
    this.updateMemoryIndicator()
  }

  updateMemoryIndicator() {
    document.getElementById("m").classList.remove("hidden")
  }

  toggleButtons(disable) {
    document.querySelectorAll("button").forEach((button) => {
      if (button.getAttribute("data-action") !== "on-ce") {
        button.disabled = disable
      }
    })
  }

  addBlinkAnimation() {
    this.display.classList.add("animate-blink")
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Calculator()
})
