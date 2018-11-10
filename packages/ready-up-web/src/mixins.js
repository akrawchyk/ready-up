const formUtilsMixin = {
  methods: {
    setProgress() {
      this.errors = []
      this.inProgress = true
    },

    setError(error) {
      this.inProgress = false
      const message = error.message || 'An unknown error occurred.'
      this.errors = [message]
    },

    reset() {
      this.inProgress = false
      this.errors = []
    }
  }
}

export { formUtilsMixin }
