const formUtilsMixin = {
  methods: {
    setProgress () {
      this.errors = []
      this.inProgress = true
    },

    setError (error) {
      this.inProgress = false
      this.errors = [error.message]
    },

    reset () {
      this.inProgress = false
      this.errors = []
    }
  }
}

export {
  formUtilsMixin
}
