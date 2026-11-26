import './styles/index.pcss'
import AppController from './controllers/AppController'

document.addEventListener('DOMContentLoaded', () => {
  const appController = new AppController()
  appController.render()
})
