<script setup>
import { FormInput, FormSelect } from '@/components/base/Form'
import Pagination from '@/components/base/Pagination'
import { Menu, Popover } from '@/components/base/Headless'
import { useUsers, useSearch, usePagination, useStatusUser, useToast } from '@/hooks/users/'
import { onMounted } from 'vue'
import Lucide from '@/components/base/Lucide'
import Button from '@/components/base/Button'
import Table from '@/components/base/Table'
import Tippy from '@/components/base/Tippy'
import LoadingIcon from '@/components/base/LoadingIcon'
import ToastNotification from '@/components/ToastNotification'
import { useRoles } from '@/hooks/roles/useRoles'
import { calculateAge } from '@/logic/'
import { useRouter } from 'vue-router'
import { Baseurl } from '@/../global'
import { formatPhone } from '@/logic/formatNumber'

const { users, loading, error, loadUsers } = useUsers()
const { roles, loadingRoles, errorRoles, loadRoles } = useRoles()
const { searchQuery, selectedStatus, selectedRole, filteredUsers, filtersCount } = useSearch(users)
const { currentPage, pageSize, totalPages, paginatedUsers, changePage, changePageSize } =
  usePagination(filteredUsers)
const { toastMessages, showToast } = useToast()
const { updateStatus } = useStatusUser({ showToast })
const router = useRouter()

// Cargar las áreas al iniciar el componente
onMounted(() => {
  loadUsers()
  loadRoles()
})
const handleAccept = (id) => {
  id_actividad.value = id // Guarda el ID en la variable reactiva
  loadObjectives(id_actividad.value) // Pasa el valor del ID de la actividad
}
</script>

<template>
  <!--? ######################## TOAST NOTIFICATION ######################## -->

  <div>
    <ToastNotification
      v-for="(message, index) in toastMessages"
      :key="index"
      :message="message"
      :index="index"
    >
    </ToastNotification>
  </div>

  <div class="grid grid-cols-12 gap-y-10 gap-x-6">
    <div class="col-span-12">
      <div class="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
        <div class="text-base font-medium group-[.mode--light]:text-white">Usuarios</div>
        <div class="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ml-auto">
          <Button
            variant="primary"
            class="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent"
            @click="
              () => {
                router.push({
                  name: 'addUser'
                })
              }
            "
          >
            <Lucide icon="PenLine" class="stroke-[1.3] w-4 h-4 mr-2" /> Agregar nuevo usuario
          </Button>
        </div>
      </div>
      <div class="mt-3.5">
        <div class="flex flex-col box box--stacked">
          <div class="flex flex-col p-5 sm:items-center sm:flex-row gap-y-2">
            <div>
              <div class="relative">
                <Lucide
                  icon="Search"
                  class="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500"
                />
                <FormInput
                  v-model="searchQuery"
                  type="text"
                  placeholder="Buscar nombre de usuario..."
                  class="pl-9 sm:w-72 rounded-[0.5rem]"
                />
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:ml-auto">
              <Popover class="inline-block" v-slot="{ close }">
                <Popover.Button :as="Button" variant="outline-secondary" class="w-full sm:w-auto">
                  <Lucide icon="ArrowDownWideNarrow" class="stroke-[1.3] w-4 h-4 mr-2" />
                  Filtrar
                  <div
                    class="flex items-center justify-center h-5 px-1.5 ml-2 text-xs font-medium border rounded-full bg-slate-100"
                  >
                    {{ filtersCount }}
                  </div>
                </Popover.Button>
                <Popover.Panel placement="bottom-end">
                  <div class="p-2 space-y-4">
                    <div>
                      <div class="text-left text-slate-500">Estado</div>
                      <FormSelect v-model="selectedStatus" class="flex-1 mt-2">
                        <option :value="null">Todos</option>
                        <option :value="1">Activo</option>
                        <option :value="2">Inactivo</option>
                      </FormSelect>
                    </div>
                    <div>
                      <div class="text-left text-slate-500">Rol</div>
                      <FormSelect v-model="selectedRole" class="flex-1 mt-2">
                        <!--? Mostrar 'Cargando roles...' cuando loadingRoles es true -->
                        <template v-if="loadingRoles">
                          <option>Cargando roles...</option>
                        </template>

                        <!--? Mostrar mensaje de error cuando hay errorRoles -->
                        <template v-if="errorRoles">
                          <option>Error al cargar roles</option>
                        </template>

                        <!--? Mostrar los roles cuando no está cargando y no existe ningun errorRoles -->
                        <template v-if="!loadingRoles">
                          <option :value="null">Todos</option>
                          <template v-for="rol in roles" :key="rol.id">
                            <option :value="rol.id">{{ rol.name }}</option>
                          </template>
                        </template>
                      </FormSelect>
                    </div>
                    <div class="flex items-center mt-4">
                      <Button
                        variant="secondary"
                        @click="
                          () => {
                            close()
                          }
                        "
                        class="w-32 ml-auto"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </Popover.Panel>
              </Popover>
            </div>
          </div>
          <div class="overflow-auto xl:overflow-visible">
            <Table class="border-b border-slate-200/60">
              <Table.Thead>
                <Table.Tr>
                  <Table.Td
                    class="w-5 py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500"
                  >
                    Foto
                  </Table.Td>
                  <Table.Td
                    class="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500"
                  >
                    Nombre / Correo electrónico
                  </Table.Td>
                  <Table.Td
                    class="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500"
                  >
                    Edad
                  </Table.Td>
                  <Table.Td
                    class="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500"
                  >
                    Teléfono
                  </Table.Td>
                  <Table.Td
                    class="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500"
                  >
                    Rol
                  </Table.Td>
                  <Table.Td
                    class="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500"
                  >
                    Estado
                  </Table.Td>
                  <Table.Td
                    class="py-4 font-medium text-center border-t w-36 bg-slate-50 border-slate-200/60 text-slate-500"
                  >
                  </Table.Td>
                </Table.Tr>
              </Table.Thead>

              <!--? Mostrar 'Cargando información...' cuando loading es true -->
              <Table.Tbody v-if="loading">
                <Table.Tr>
                  <Table.Td colspan="7" class="py-8 text-center text-xl font-bold text-green-500">
                    <div class="flex flex-col w-full justify-center items-center text-nowrap">
                      <LoadingIcon icon="tail-spin" class="h-8" color="black" />
                      <div class="mt-2">Cargando información...</div>
                    </div>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>

              <!--? Mostrar mensaje de error cuando hay error -->
              <Table.Tbody v-if="error">
                <Table.Tr>
                  <Table.Td colspan="7" class="py-8 text-center text-xl font-bold text-red-500">
                    Error al cargar la información, Inténtelo más tarde
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>

              <!--? Mostrar mensaje de error cuando no se encuentran usuarios -->
              <Table.Tbody v-if="!loading && totalPages <= 0 && !error">
                <Table.Tr>
                  <Table.Td colspan="7" class="py-8 text-center text-xl font-bold text-amber-500">
                    Ningun usuario encontrado
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>

              <!--? Mostrar la tabla de áreas cuando no está cargando y no existe ningun error -->
              <Table.Tbody v-if="!loading && totalPages > 0">
                <template v-for="user in paginatedUsers" :key="user.id">
                  <Table.Tr class="[&_td]:last:border-b-0">
                    <Table.Td class="py-4 border-dashed dark:bg-darkmode-600">
                      <div class="flex">
                        <div class="w-9 h-9 image-fit zoom-in">
                          <Tippy
                            as="img"
                            alt="Tailwise - Admin Dashboard Template"
                            class="rounded-full cursor-default shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                            :src="`${Baseurl}${user.photo}`"
                            :disable="true"
                            :content="`Image User`"
                          />
                        </div>
                      </div>
                    </Table.Td>
                    <Table.Td class="py-4 border-dashed dark:bg-darkmode-600">
                      <div class="font-medium whitespace-nowrap">
                        {{ user.name }}
                      </div>
                      <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                        {{ user.email }}
                      </div>
                    </Table.Td>
                    <Table.Td class="py-4 border-dashed dark:bg-darkmode-600">
                      <div class="whitespace-nowrap">
                        {{ calculateAge(user.birthdate) }}
                      </div>
                    </Table.Td>
                    <Table.Td class="py-4 border-dashed dark:bg-darkmode-600">
                      <div class="flex items-center text-primary">
                        <Lucide icon="Phone" class="w-4 h-4 mr-2" />
                        {{ formatPhone(user.phone) }}
                      </div>
                    </Table.Td>
                    <Table.Td
                      class="py-4 border-dashed dark:bg-darkmode-600"
                      @click="
                        () => {
                          console.log(roles)
                        }
                      "
                    >
                      <div class="whitespace-nowrap">
                        {{ roles[user.rol - 1].name }}
                      </div>
                    </Table.Td>
                    <Table.Td class="py-4 border-dashed dark:bg-darkmode-600">
                      <div
                        :class="[
                          'flex items-center justify-start',
                          { 'text-success': user.status == 1 },
                          { 'text-danger': user.status !== 1 },
                          { 'text-[#FFA500]': user.status == 0 }
                        ]"
                      >
                        <Lucide
                          v-if="user.status == 1 || user.status == 2"
                          icon="Database"
                          class="w-3.5 h-3.5 stroke-[1.7]"
                        />
                        <div
                          class="ml-1.5 whitespace-nowrap max-h-8 flex flex-row items-center justify-center gap-2"
                        >
                          <div class="w-4 h-4" v-if="user.status == 0">
                            <LoadingIcon icon="bars" class="w-8 h-8" color="#FFA500" />
                          </div>
                          <span v-if="user.status == 0" class="text-amber-500">Cambiando....</span>
                          <span v-else-if="user.status == 1" class="text-success">Activo</span>
                          <span v-else class="text-danger">Inactivo</span>
                        </div>
                      </div>
                    </Table.Td>
                    <Table.Td class="relative py-4 border-dashed dark:bg-darkmode-600">
                      <div class="flex items-center justify-center">
                        <Menu class="h-5">
                          <Menu.Button class="w-5 h-5 text-black">
                            <Lucide icon="MoreVertical" class="w-5 h-5 stroke-black fill-black" />
                          </Menu.Button>
                          <Menu.Items class="w-40">
                            <Menu.Item class="text-warning">
                              <Lucide icon="CheckSquare" class="w-4 h-4 mr-2" />
                              Editar
                            </Menu.Item>
                            <Menu.Item
                              :class="`${user.status == 1 ? 'text-blue' : 'text-[#ff6f0f]'}`"
                              @click="
                                () => {
                                  updateStatus({ user }).then((updatedUser) => {
                                    const index = users.findIndex((u) => u.id == updatedUser.id)
                                    if (index !== -1) {
                                      users[index] = updatedUser
                                    }
                                  })
                                }
                              "
                            >
                              <Lucide icon="RefreshCw" class="w-4 h-4 mr-2" />
                              Cambiar Estado
                            </Menu.Item>
                          </Menu.Items>
                        </Menu>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                </template>
              </Table.Tbody>
            </Table>
          </div>
          <div
            class="flex flex-col-reverse flex-wrap items-center p-5 flex-reverse gap-y-2 sm:flex-row"
          >
            <Pagination class="flex-1 w-full mr-auto sm:w-auto">
              <Pagination.Link @click="changePage(1)">
                <Lucide icon="ChevronsLeft" class="w-4 h-4" />
              </Pagination.Link>
              <Pagination.Link @click="changePage(currentPage - 1)">
                <Lucide icon="ChevronLeft" class="w-4 h-4" />
              </Pagination.Link>
              <template v-for="page in totalPages" :key="page">
                <Pagination.Link :active="page === currentPage" @click="changePage(page)">
                  {{ page }}
                </Pagination.Link>
              </template>
              <Pagination.Link @click="changePage(currentPage + 1)">
                <Lucide icon="ChevronRight" class="w-4 h-4" />
              </Pagination.Link>
              <Pagination.Link @click="changePage(totalPages)">
                <Lucide icon="ChevronsRight" class="w-4 h-4" />
              </Pagination.Link>
            </Pagination>
            <FormSelect
              class="sm:w-20 rounded-[0.5rem]"
              v-model="pageSize"
              @change="changePageSize"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </FormSelect>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
