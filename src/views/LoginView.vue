<script setup>
import { FormInput, FormLabel, InputGroup } from '@/components/base/Form'
import Button from '@/components/base/Button'
import Alert from '@/components/base/Alert'
import Lucide from '@/components/base/Lucide'
import LoadingIcon from '@/components/base/LoadingIcon'
import { useFormValidation } from '@/hooks/login/useFormValidation'
import { useAuth } from '@/hooks/login/useAuth'
import { useRouter } from 'vue-router'
import { useRefs } from '@/hooks/login/useRefs'

const { showPassword } = useRefs()
const { loginUser, loading, error } = useAuth()
const { email, password, valid, validateInput } = useFormValidation({ error })
const router = useRouter()
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
      <div class="relative z-10 flex flex-col justify-center w-full h-full py-2 lg:py-32">
        <div class="flex flex-row justify-start items-center">
          <span
            @click="router.push({ name: 'home' })"
            class="flex flex-row gap-2 transition-all duration-200 hover:scale-95 !bg-white/[0.12] !text-black !border-transparent cursor-pointer"
          >
            <Lucide icon="ArrowLeft" class="w-5 h-5" />
            Regresar
          </span>
        </div>
        <div class="mt-10">
          <div class="text-2xl font-medium">Iniciar sesión</div>

          <Alert
            variant="outline-danger"
            v-if="error"
            class="flex items-center px-4 py-3 my-7 bg-danger/5 border-danger/20 rounded-[0.6rem] leading-[1.7]"
            v-slot="{ dismiss }"
          >
            <div class="">
              <Lucide
                icon="AlertTriangle"
                class="stroke-[0.8] stroke-danger w-7 h-7 mr-2 fill-danger/10"
              />
            </div>
            <div class="ml-1 mr-8">
              <span class="text-danger">{{ error }}</span>
            </div>
            <Alert.DismissButton
              type="button"
              class="btn-close text-danger"
              @click="dismiss"
              aria-label="Cerrar"
            >
              <Lucide icon="X" class="w-5 h-5" />
            </Alert.DismissButton>
          </Alert>

          <div class="mt-6">
            <FormLabel>Correo electrónico <span class="text-red-600 bold">*</span></FormLabel>
            <FormInput
              type="text"
              class="block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80"
              placeholder="correo@mail.com"
              v-model="email"
              @input="validateInput('email')"
            />

            <FormLabel class="mt-4">Contraseña <span class="text-red-600 bold">*</span></FormLabel>

            <div class="flex-1 w-full mt-3 xl:mt-0">
              <InputGroup class="mt-2">
                <FormInput
                  placeholder="************"
                  :type="`${showPassword ? 'text' : 'password'}`"
                  htmlid="inputPassword"
                  class="block px-4 py-3.5"
                  name="password"
                  v-model="password"
                  @input="validateInput('password')"
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
            </div>
            <div
              class="flex flex-row justify-end mt-4 text-xs text-slate-500 sm:text-sm hover:text-green-500"
            >
              <span class="cursor-pointer" @click="router.push({ name: 'forgotPassword' })"
                >¿Olvidaste tu contraseña?</span
              >
            </div>
            <!-- avisos de privacidad -->
            <div class="flex items-center mt-5 text-xs sm:text-sm">
              Lee nuestros
              <a class="ml-1 text-primary dark:text-slate-200" href="/privacy" target="_blank">
                Avisos de privacidad
              </a>
            </div>
            <div class="mt-5 text-center xl:mt-8 xl:text-left">
              <Button
                @click="
                  () => {
                    loginUser({ email, password })
                  }
                "
                :disabled="!valid || loading"
                variant="primary"
                rounded
                :class="`bg-gradient-to-r transition-all border-none scale-105 duration-200 w-full py-3.5 xl:mr-3 ${valid && !loading ? 'from-green-dark to-green hover:scale-100 select-none cursor-pointer' : 'from-gray-600 to-gray-600 cursor-default'}`"
              >
                <LoadingIcon v-if="loading" icon="three-dots" class="w-8 h-5" color="white" />
                {{ loading ? '' : 'Iniciar Sesión' }}
              </Button>
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
        'before:content-[\'\'] before:absolute before:lg:-ml-10 before:left-0 before:inset-y-0 before:bg-gradient-to-b before:from-customGreen before:to-customGreen before:w-screen before:lg:w-[800%]',
        'after:content-[\'\'] after:absolute after:inset-y-0 after:left-0 after:w-screen after:lg:w-[800%] after:bg-texture-white after:bg-fixed after:bg-center after:lg:bg-[25rem_-25rem] after:bg-no-repeat'
      ]"
    >
      <div
        class="sticky top-0 z-10 flex-col justify-center hidden h-screen ml-16 lg:flex xl:ml-28 2xl:ml-36"
      >
        <div
          class="leading-[1.4] text-[2.6rem] xl:text-5xl font-medium xl:leading-[1.2] text-white"
        >
          Transformemos vidas <br />
          con educación y solidaridad
        </div>
        <div class="mt-5 text-base leading-relaxed xl:text-lg text-white/70">
          Únete a nuestro equipo de voluntarios y sé parte del cambio. Juntos, llevamos
          oportunidades educativas a las comunidades que más lo necesitan. ¡Construyamos un futuro
          más brillante!
        </div>
      </div>
    </div>
  </div>
</template>
