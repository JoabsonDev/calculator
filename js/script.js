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
    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.getAttribute("data-action")

        if (isFinite(action)) {
          this.handleNumber(action)
        } else if (action === ".") {
          this.handleDecimal()
        } else {
          this.handleAction(action)
        }
        this.addBlinkAnimation()
      })
    })

    this.display.addEventListener("animationend", () =>
      this.display.classList.remove("animate-blink")
    )

    // Adiciona o listener para eventos de teclado
    document.addEventListener("keydown", (event) => {
      this.handleKeyboard(event)
    })
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
    } else if (this.display.value === "" || this.display.value === "0") {
      this.display.value = "0."
    } else if (!this.display.value.includes(".")) {
      this.display.value += "."
    }
    this.memoryRecall = false
  }

  handleAction(action) {
    switch (action) {
      case "on-ce":
        this.resetCalculator()
        break
      case "off":
        this.turnOff()
        break
      case "mrc":
        this.memoryRecallClear()
        break
      case "m-plus":
        this.memoryAdd()
        break
      case "m-minus":
        this.memorySubtract()
        break
      case "√":
        this.squareRoot()
        break
      case "%":
        this.percentage()
        break
      case "/":
      case "*":
      case "-":
      case "+":
        this.handleOperation(action)
        break
      case "=":
        this.calculate()
        break
    }
  }

  resetCalculator() {
    this.display.value = "0"
    this.memory = 0
    this.currentOperation = null

    this.display.placeholder = "0"
    document.querySelectorAll("button").forEach((button) => {
      button.disabled = false
    })
    document.getElementById("m").classList.add("hidden")
  }

  turnOff() {
    this.display.value = ""
    this.display.placeholder = ""

    document.querySelectorAll("button").forEach((button) => {
      if (button.getAttribute("data-action") !== "on-ce") {
        button.disabled = true
      }
    })
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
    this.display.value = this.memory
    document.getElementById("m").classList.remove("hidden")
  }

  memorySubtract() {
    this.memory -= parseFloat(this.display.value)
    this.resetDisplay = true
    this.display.value = this.memory
    document.getElementById("m").classList.remove("hidden")
  }

  squareRoot() {
    this.display.value = Math.sqrt(parseFloat(this.display.value))
  }

  percentage() {
    this.display.value = parseFloat(this.display.value) / 100
  }

  handleOperation(operation) {
    if (this.currentOperation !== null && !this.resetDisplay) {
      this.calculate()
    }
    this.currentOperation = operation
    this.memory = parseFloat(this.display.value)
    this.resetDisplay = true
  }

  calculate() {
    if (this.currentOperation === null) return

    const currentValue = parseFloat(this.display.value)
    let result

    switch (this.currentOperation) {
      case "/":
        result = this.memory / currentValue
        break
      case "*":
        result = this.memory * currentValue
        break
      case "-":
        result = this.memory - currentValue
        break
      case "+":
        result = this.memory + currentValue
        break
    }

    this.display.value = result
    this.currentOperation = null
    this.resetDisplay = true
  }

  addBlinkAnimation() {
    this.display.classList.add("animate-blink")
  }

  handleKeyboard(event) {
    const key = event.key
    const keyCode = event.keyCode

    // Mapear as teclas para ações
    switch (key) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.handleNumber(key)
        break
      case ".":
        this.handleDecimal()
        break
      case "+":
        this.handleAction("+")
        break
      case "-":
        this.handleAction("-")
        break
      case "*":
        this.handleAction("*")
        break
      case "/":
        this.handleAction("/")
        break
      case "Enter":
        this.handleAction("=")
        break
      case "Escape":
        this.handleAction("on-ce")
        break
      case "m":
        if (event.ctrlKey) {
          // Ctrl + M
          this.handleAction("mrc")
        }
        break
      case "M":
        if (event.shiftKey) {
          // Shift + M
          this.handleAction("m-plus")
        }
        break
      case "N":
        if (event.shiftKey) {
          // Shift + N
          this.handleAction("m-minus")
        }
        break
    }

    this.addBlinkAnimation()
  }
}

document.addEventListener("DOMContentLoaded", function () {
  new Calculator()
})
