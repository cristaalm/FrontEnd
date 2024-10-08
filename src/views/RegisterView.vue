<script setup>
import { useValidationFunctions } from '@/hooks/register/useValidationFunctions'
import { FormCheck, FormInput, FormLabel, InputGroup } from '@/components/base/Form'
import { useStatus } from '@/hooks/register/useStatus'
import LoadingIcon from '@/components/base/LoadingIcon'
import Lucide from '@/components/base/Lucide'
import { useRefs } from '@/hooks/register/useRefs'
import { useAuth } from '@/hooks/register/useAuth'
import Button from '@/components/base/Button'
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'

const { status, resetFields } = useStatus()
const {
  password,
  firstName,
  lastName,
  email,
  phone,
  birthdate,
  terms,
  password_confirm,
  valid,
  perfil,
  showPassword,
  showPasswordConfirm
} = useRefs()
const { validateText, validateInputPhone, validate } = useValidationFunctions({
  firstName,
  lastName,
  email,
  phone,
  birthdate,
  terms,
  perfil,
  password,
  password_confirm,
  valid,
  status
})
const { registerUser, loading } = useAuth({
  password,
  firstName,
  lastName,
  email,
  perfil,
  phone,
  birthdate,
  valid,
  validate,
  resetFields
})
const router = useRouter()
const route = useRoute()

onMounted(() => {
  const rol = route.params.rol

  if (rol) {
    // si rol existe
    perfil.value = rol
  } else {
    router.push({ name: 'home' }) // Redirige si el rol no es válido
  }
})

const handleSubmit = () => {
  if (valid.value) {
    registerUser()
  }
}
</script>

<template>
  <div
    class="container grid lg:h-screen grid-cols-12 lg:max-w-[1550px] 2xl:max-w-[1750px] py-10 px-5 sm:py-14 sm:px-10 md:px-36 lg:py-0 lg:pl-14 lg:pr-12 xl:px-24"
  >
    <div
      :class="[
        'relative z-50 h-full col-span-12 p-7 sm:p-14 bg-white rounded-2xl lg:bg-transparent lg:pr-10 lg:col-span-5 xl:pr-24 2xl:col-span-4 lg:p-0'
      ]"
    >
      <div class="relative z-10 flex flex-col justify-center w-full h-full py-2">
        <div class="flex flex-row justify-start items-center pt-5">
          <span
            @click="router.push({ name: 'home' })"
            class="flex flex-row gap-2 transition-all duration-200 hover:scale-95 !bg-white/[0.12] !text-black !border-transparent cursor-pointer"
          >
            <Lucide icon="ArrowLeft" class="w-5 h-5" />
            Regresar
          </span>
        </div>
        <div class="mt-10">
          <div class="text-2xl font-medium">
            Registrarse como
            <span class="font-bold text-blue">{{
              perfil == 5 ? 'Beneficiario' : perfil == 4 ? 'Voluntario' : 'Donante'
            }}</span>
          </div>
          <div class="mt-6">
            <!--? ################### FIRSTNAME ###################### -->

            <FormLabel htmlFor="firstName"
              >Nombre <span class="text-red-600 bold">*</span></FormLabel
            >
            <FormInput
              type="text"
              name="firstName"
              id="firstName"
              :class="`block px-4 py-3.5 border-[2px] rounded-[0.6rem]  ${status.firstName.error ? 'border-red-300/80' : 'border-slate-300/80'}`"
              v-model="firstName"
            />
            <div class="flex flex-row text-red-600 p-2" v-if="status.firstName.menssage">
              {{ status.firstName.menssage }}
            </div>

            <!--? ################### LASTNAME ###################### -->

            <FormLabel class="mt-5" htmlFor="lastName"
              >Apellido <span class="text-red-600 bold">*</span></FormLabel
            >
            <FormInput
              type="text"
              name="lastName"
              id="lastName"
              :class="`block px-4 py-3.5 border-[2px] rounded-[0.6rem] ${status.lastName.error ? 'border-red-300/80' : 'border-slate-300/80'}`"
              v-model="lastName"
            />
            <div class="flex flex-row text-red-600 p-2" v-if="status.lastName.menssage">
              {{ status.lastName.menssage }}
            </div>

            <!--? ################### EMAIL ###################### -->

            <FormLabel class="mt-5" htmlFor="email"
              >Correo electrónico <span class="text-red-600 bold">*</span>
            </FormLabel>
            <FormInput
              type="text"
              name="email"
              id="email"
              autocomplete="email"
              :class="`block px-4 py-3.5 border-[2px] rounded-[0.6rem] ${status.email.error ? 'border-red-300/80' : 'border-slate-300/80'}`"
              v-model="email"
            />
            <div class="flex flex-row text-red-600 p-2" v-if="status.email.menssage">
              {{ status.email.menssage }}
            </div>

            <!--? ################### PHONE ###################### -->

            <FormLabel class="mt-5" htmlFor="phone"
              >Teléfono celular <span class="text-red-600 bold">*</span>
            </FormLabel>
            <FormInput
              type="text"
              name="phone"
              id="phone"
              autocomplete="tel"
              :class="`block px-4 py-3.5 border-[2px] rounded-[0.6rem] ${status.phone.error ? 'border-red-300/80' : 'border-slate-300/80'}`"
              v-model="phone"
              @input="
                (e) => {
                  validateInputPhone(e)
                  validateText(e)
                }
              "
            />
            <div class="flex flex-row text-red-600 p-2" v-if="status.phone.menssage">
              {{ status.phone.menssage }}
            </div>

            <!--? ################### BIRTHDATE ###################### -->

            <FormLabel class="mt-5" htmlFor="birthdate">
              Fecha de nacimiento
              <span class="text-red-600 bold">*</span>
            </FormLabel>
            <FormInput
              type="date"
              name="birthdate"
              id="birthdate"
              :class="`block px-4 py-3.5 border-[2px] rounded-[0.6rem] ${status.birthdate.error ? 'border-red-300/80' : 'border-slate-300/80'}`"
              v-model="birthdate"
            />
            <div class="flex flex-row text-red-600 p-2" v-if="status.birthdate.menssage">
              {{ status.birthdate.menssage }}
            </div>

            <!--? ################### PASSWORD ###################### -->

            <FormLabel class="mt-5" htmlFor="password"
              >Contraseña <span class="text-red-600 bold">*</span></FormLabel
            >

            <InputGroup class="mt-2">
              <FormInput
                :type="`${showPassword ? 'text' : 'password'}`"
                :class="`block px-4 py-3.5 border-[2px] ${status.password.error ? 'border-red-300/80' : 'border-slate-300/80'}`"
                placeholder="**********"
                v-model="password"
              />
              <InputGroup.Text
                @click="
                  () => {
                    showPassword = !showPassword
                  }
                "
                class="cursor-pointer flex flex-col justify-center items-center"
              >
                <button class="">
                  <Lucide
                    icon="Eye"
                    class="w-4 h-4 stroke-[1.3] text-green-500"
                    v-if="showPassword"
                  />
                  <Lucide icon="EyeOff" class="w-4 h-4 stroke-[1.3] text-red-500" v-else />
                </button>
              </InputGroup.Text>
            </InputGroup>

            <div class="flex flex-row text-red-600 p-2" v-if="status.password.menssage">
              {{ status.password.menssage }}
            </div>
            <div class="grid w-full h-1.5 grid-cols-12 gap-4 mt-3.5">
              <div
                :class="`h-full col-span-3 border rounded bg-slate-400/30 border-slate-400/20 ${status.password.color} ${status.password.secure >= 0 ? 'active' : ''}`"
              ></div>
              <div
                :class="`h-full col-span-3 border rounded bg-slate-400/30 border-slate-400/20 ${status.password.color} ${status.password.secure >= 2 ? 'active' : ''}`"
              ></div>
              <div
                :class="`h-full col-span-3 border rounded bg-slate-400/30 border-slate-400/20 ${status.password.color} ${status.password.secure >= 3 ? 'active' : ''}`"
              ></div>
              <div
                :class="`h-full col-span-3 border rounded bg-slate-400/30 border-slate-400/20 ${status.password.color} ${status.password.secure >= 4 ? 'active' : ''}`"
              ></div>
            </div>
            <div :class="`mt-2 ${status.password.error ? 'text-red-500' : 'text-blue-600'}`">
              {{ status.password.message }}
              <ul v-if="status.password.secure != 4">
                <li v-for="item in status.password.list" :key="item" class="list-disc list-inside">
                  {{ item }}
                </li>
              </ul>
            </div>

            <!--? ################### PASSWORD CONFIRM ###################### -->

            <FormLabel class="mt-5" htmlFor="password_confirm">
              Confirmación de contraseña
              <span class="text-red-600 bold">*</span>
            </FormLabel>

            <InputGroup class="mt-2">
              <FormInput
                :type="`${showPasswordConfirm ? 'text' : 'password'}`"
                :class="`block px-4 py-3.5 border-[2px] ${status.password_confirm.error ? 'border-red-300/80' : 'border-slate-300/80'}`"
                placeholder="**********"
                v-model="password_confirm"
              />
              <InputGroup.Text
                @click="
                  () => {
                    showPasswordConfirm = !showPasswordConfirm
                  }
                "
                class="cursor-pointer flex flex-col justify-center items-center"
              >
                <button class="">
                  <Lucide
                    icon="Eye"
                    class="w-4 h-4 stroke-[1.3] text-green-500"
                    v-if="showPasswordConfirm"
                  />
                  <Lucide icon="EyeOff" class="w-4 h-4 stroke-[1.3] text-red-500" v-else />
                </button>
              </InputGroup.Text>
            </InputGroup>

            <div class="flex flex-row text-red-600 p-2" v-if="status.password_confirm.menssage">
              {{ status.password_confirm.menssage }}
            </div>

            <!--? ################### TERMS ###################### -->

            <div
              :class="`flex items-center mt-5 text-xs  sm:text-sm ${status.terms.error ? 'text-red-600' : 'text-slate-500'}`"
            >
              <FormCheck.Input
                name="terms"
                id="terms"
                type="checkbox"
                class="mr-2 border"
                v-model="terms"
              />
              <label class="cursor-pointer select-none" htmlFor="terms">
                Acepto los
                <a class="ml-1 text-primary dark:text-slate-200" href="/terms" target="_blank">
                  terminos y condiciones
                </a>
              </label>
              .
            </div>

            <!--? ################### PRIVACY ###################### -->

            <div class="flex items-center mt-5 text-xs sm:text-sm">
              Lee nuestros
              <a class="ml-1 text-primary dark:text-slate-200" href="/privacy" target="_blank">
                Avisos de privacidad
              </a>
            </div>

            <!--? ################### BUTTON ###################### -->

            <div class="mt-5 text-center xl:mt-8 xl:text-left">
              <Button
                @click="handleSubmit"
                :disabled="!valid"
                variant="primary"
                rounded
                :class="`bg-gradient-to-r transition-all border-none scale-105 duration-200 w-full py-3.5 xl:mr-3 ${valid && !loading ? 'from-green-dark to-green hover:scale-100 select-none cursor-pointer' : 'from-gray-600 to-gray-600  cursor-default'}`"
              >
                <LoadingIcon v-if="loading" icon="three-dots" class="w-8 h-5" color="white" />
                {{ !loading ? 'Registrarse' : '' }}
              </Button>
            </div>
            <div class="mt-2.5 text-black mb-5">
              ¿Ya tienes una cuenta?
              <span
                class="font-medium text-primary cursor-pointer"
                @click="router.push({ name: 'login' })"
              >
                Iniciar sesión
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="fixed container grid w-screen inset-0 h-screen grid-cols-12 lg:max-w-[1550px] 2xl:max-w-[1750px] pl-14 pr-12 xl:px-24"
  >
    <div
      :class="[
        'relative h-screen col-span-12 lg:col-span-5 2xl:col-span-4 z-20',
        'after:bg-white after:hidden after:lg:block after:content-[\'\'] after:absolute after:right-0 after:inset-y-0 after:bg-gradient-to-b after:from-white after:to-slate-100/80 after:w-[800%] after:rounded-[0_1.2rem_1.2rem_0/0_1.7rem_1.7rem_0]',
        'before:content-[\'\'] before:hidden before:lg:block before:absolute before:right-0 before:inset-y-0 before:my-6 before:bg-gradient-to-b before:from-white/10 before:to-slate-50/10 before:bg-white/50 before:w-[800%] before:-mr-4 before:rounded-[0_1.2rem_1.2rem_0/0_1.7rem_1.7rem_0]'
      ]"
    ></div>
    <div
      :class="[
        'h-full col-span-7 2xl:col-span-8 lg:relative',
        'before:content-[\'\'] before:absolute before:lg:-ml-10 before:left-0 before:inset-y-0 before:bg-gradient-to-b before:from-green-dark before:to-green-dark before:w-screen before:lg:w-[800%]',
        'after:content-[\'\'] after:absolute after:inset-y-0 after:left-0 after:w-screen after:lg:w-[800%] after:bg-texture-white after:bg-fixed after:bg-center after:lg:bg-[25rem_-25rem] after:bg-no-repeat'
      ]"
    >
      <div
        class="sticky top-0 z-10 flex-col justify-center hidden h-screen ml-16 lg:flex xl:ml-28 2xl:ml-36"
      >
        <div
          class="leading-[1.4] text-[2.6rem] xl:text-5xl font-medium xl:leading-[1.2] text-white"
        >
          Únete a nuestra causa <br />
          y marca la diferencia
        </div>
        <div class="mt-5 text-base leading-relaxed xl:text-lg text-white/70">
          Regístrate como voluntario y ayúdanos a llevar educación y esperanza a las comunidades que
          más lo necesitan. ¡Tu compromiso puede transformar vidas!
        </div>
      </div>
    </div>
  </div>
</template>
