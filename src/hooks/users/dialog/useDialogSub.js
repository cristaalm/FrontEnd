import { ref } from 'vue'
import { changeStatus, deleteUser } from '@/services/users/changeStatus'

export function useDialog({ showToast, users }) {
  const dialogStatusModal = ref(false)
  const userIdSub = ref('')
  const statusId = ref('')

  const openModal = (id, action) => {
    userIdSub.value = id
    statusId.value = action
    dialogStatusModal.value = true
  }

  const confirmSubscription = async () => {
    let result = false
    try {
      if (statusId.value === 'accept') {
        result = await changeStatus(userIdSub.value, 1)
        console.log(`User ${userIdSub.value} accepted`)
      } else if (statusId.value === 'reject') {
        result = await deleteUser(userIdSub.value)
        console.log(`User ${userIdSub.value} rejected`)
      }

      if (result) {
        users.value = users.value.filter((user) => user.id !== userIdSub.value)
        showToast('Acción realizada exitosamente.')
      } else {
        showToast('Error al realizar la acción.')
      }

      dialogStatusModal.value = false
      userIdSub.value = null
    } catch (error) {
      console.error('Error en la acción:', error)
      showToast('Error inesperado.')
    }
  }

  const closeModal = () => {
    dialogStatusModal.value = false
  }

  return { dialogStatusModal, openModal, confirmSubscription, closeModal }
}
