'use client'

import { useState, type ReactNode } from 'react'

// ── Quick-bar filters ──────────────────────────────────────────
const filters = [
  {
    label: 'Tümü',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#0E8FCF" fillRule="evenodd" clipRule="evenodd">
        <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12ZM17.4545 6.90343C17.784 7.15446 17.8476 7.62505 17.5966 7.95453L10.7394 16.9545C10.6029 17.1337 10.393 17.2421 10.1678 17.2496C9.94266 17.2571 9.72604 17.163 9.57787 16.9932L6.43501 13.3932C6.1626 13.0812 6.19472 12.6074 6.50676 12.335C6.81879 12.0626 7.29258 12.0947 7.56499 12.4068L10.1033 15.3143L16.4034 7.04547C16.6545 6.71599 17.1251 6.65239 17.4545 6.90343Z" />
      </svg>
    ),
  },
  {
    label: 'Futbol',
    icon: (
      <svg width="20" height="20" viewBox="0 0 512 512" fill="#0E8FCF">
        <path d="M256 48C141.137 48 48 141.136 48 256s93.137 208 208 208c114.872 0 208-93.138 208-208S370.87 48 256 48zm41.151 394.179c-13.514 2.657-30.327 4.187-44 4.45a190.525 190.525 0 0 1-38.5-4.493 978.146 978.146 0 0 1-6.805-1.777l-24.417-65.435L203.074 336h105.854l.57 1.076 19.34 38.852-23.618 64.282a189.782 189.782 0 0 1-8.069 1.969zM189.578 77.28 247 116.576v58.147l-70.997 60.067-49.403-22.51-4.167-1.899-22.332-64.019c22.009-31.204 53.138-55.532 89.477-69.082zm221.986 68.787-22.432 64.483-53.992 24.388L264 174.723v-58.147l57.596-39.415c36.362 13.483 67.905 37.752 89.968 68.906zM66.144 273.414l53.756-46.518 49.539 22.599.559.255 19.718 77.287-20.433 38.529-69.86-.915c-18.348-26.36-30.214-57.546-33.279-91.237zm276.575 92.151-20.434-38.529 19.752-77.416 49.997-22.781 53.822 46.575c-3.065 33.691-14.932 64.877-33.277 91.236l-69.86.915z" />
      </svg>
    ),
  },
  {
    label: 'Basketbol',
    icon: (
      <svg width="20" height="20" viewBox="0 0 32 32" fill="#0E8FCF">
        <path d="M30.06 15h0c.3 0 .6 0 .9 0a14.82 14.82 0 0 0-3.68-8.82l-5.72 5.72A13 13 0 0 0 30.06 15zM20.17 10.41l5.72-5.72A14.82 14.82 0 0 0 17.07 1c0 .31 0 .62 0 .93A13 13 0 0 0 20.17 10.41zM11.84 18.74L14.58 16 4.68 6.11A14.82 14.82 0 0 0 1 15.05c.32 0 .65 0 1 0A15 15 0 0 1 11.84 18.74zM30.06 17a15 15 0 0 1-9.89-3.73L17.42 16l9.89 9.9a15 15 0 0 0 3.69-9c-.3 0-.61.05-.91.05zM2 17c-.32 0-.64 0-1 0A15 15 0 0 0 4.68 25.9l5.74-5.74A13 13 0 0 0 2 17zM25.89 27.32L16 17.42l-2.74 2.74A15 15 0 0 1 17 30c0 .33 0 .66 0 1A14.82 14.82 0 0 0 25.89 27.32zM11.84 21.58L6.1 27.32A15 15 0 0 0 14.94 31c0-.32.05-.64.05-1A13 13 0 0 0 11.84 21.58zM6.1 4.69L16 14.58l2.75-2.75A15 15 0 0 1 15 1.94c0-.31 0-.63.05-.94A15 15 0 0 0 6.1 4.69z" />
      </svg>
    ),
  },
  {
    label: 'Tenis',
    icon: (
      <svg width="20" height="20" viewBox="0 0 100 100" fill="#0E8FCF">
        <path d="M9.2 98c1.9 0 3.7-.8 5.1-2.1l22.2-22.2c.1-.1.2-.2.4-.5.9-1.3.8-3-.4-4.1l-5.6-5.6c-1.1-1.1-2.8-1.2-4.1-.4-.2.1-.4.3-.5.4L4.1 85.7C2.8 87 2 88.8 2 90.8c0 1.9.8 3.7 2.1 5.1C5.5 97.2 7.3 98 9.2 98zm61.1-79.4-7.5-7.5c-3.6 1.6-7.1 3.9-10.3 6.9l9.2 9.2 8.6-8.6zM53.1 38.7l8.6 8.5 8.6-8.7-8.5-8.5zM60.4 28.6l-9.2-9.2c-3 3.2-5.4 6.8-7 10.5l7.4 7.3 8.8-8.6zM80.1 28.4 71.7 20l-8.5 8.6 8.5 8.5zM81.5 27l8.5-8.7c-.8-1.9-1.9-3.6-3.3-5s-3.1-2.5-5-3.3l-8.6 8.6 8.4 8.4zm-8.4 11.5 8.9 8.9c2.9-3.1 5.3-6.6 6.9-10.3l-7.3-7.3-8.5 8.7zm-9.9 10.1 7.2 7.1c3.7-1.6 7.2-3.9 10.3-6.9l-8.9-8.9-8.6 8.7z" />
        <path d="M90.9 9.1c-11-11-30.8-9-44.2 4.4-7.3 7.3-11.5 16.8-11.5 26 0 4.5-1 8.4-2.8 11.8l-5 9.3c.4-.1.8-.1 1.3-.1 1.4 0 2.7.5 3.7 1.5l5.6 5.6c1.3 1.3 1.8 3.2 1.4 4.9l9.3-5c3.4-1.8 7.4-2.8 11.8-2.8 4.6 0 9.3-1.1 13.8-3 4.5-2 8.6-4.8 12.3-8.5C99.9 39.8 101.9 20 90.9 9.1zm-8.2 40.4c-5.6 5.6-12.6 9.3-19.8 10.4-1.4.2-2.8.3-4.1.3-2.4 0-4.7-.4-6.8-1h-.1c-2.7-.9-5-2.3-6.9-4.2-1.8-1.8-3.1-3.9-3.9-6.2v-.1c-2-5.5-1.6-12.2 1-18.7 0-.1 0-.1.1-.1 1.8-4.4 4.6-8.7 8.3-12.5 3.7-3.7 7.9-6.4 12.2-8.2h.1c6.6-2.7 13.4-3.1 19-1.1 0 0 .1 0 .1.1 2.3.9 4.5 2.2 6.2 3.9 4.3 4.3 6 10.6 5 17.9-1.1 6.9-4.7 13.9-10.4 19.5z" />
        <path d="M79.6 9.3c-1.7-.5-3.5-.7-5.4-.7-3 0-6.2.6-9.4 1.7l6.9 6.9 7.9-7.9zm3.3 19.1 6.7 6.7c.7-1.9 1.2-3.8 1.4-5.7.5-3.3.3-6.4-.4-9.1l-7.7 8.1zM54.3 57.7c2.5.6 5.4.7 8.4.2 1.9-.3 3.8-.8 5.6-1.4L61.8 50l-7.5 7.7zM43.4 32c-1.8 5-2.1 10.1-.9 14.5l7.8-7.8-6.9-6.7zm8.3 8.1-8.5 8.5c.8 1.9 1.9 3.6 3.3 5 1.6 1.6 3.5 2.8 5.6 3.5l8.2-8.4-8.6-8.6zm24.5 39.3c2.4-3.3 3.5-7.3 3-11.3-4.1.5-7.8 2.6-10.3 5.9-2.5 3.4-3.4 7.5-2.7 11.6 4-.8 7.6-3 10-6.2z" />
        <path d="M95 78c-1-2.8-2.8-5.3-5.2-7.1-2.5-1.9-5.5-2.9-8.6-2.9.5 4.4-.7 8.9-3.4 12.6-2.7 3.6-6.6 6.1-11 7 .4 1.2.9 2.3 1.5 3.3 1 1.6 2.2 2.9 3.8 4 2.4 1.8 5.3 2.8 8.4 2.9-.3-4.5.9-8.9 3.6-12.6C86.8 81.6 90.6 79 95 78z" />
        <path d="M82.5 97.7c4.1-.4 7.9-2.6 10.4-6s3.4-7.6 2.6-11.7v-.1c-3.9.9-7.4 3.2-9.8 6.4-2.4 3.4-3.6 7.3-3.2 11.4z" />
      </svg>
    ),
  },
  {
    label: 'Buzhokeyi',
    icon: (
      <svg width="20" height="20" viewBox="0 0 48 48" fill="#0E8FCF">
        <ellipse cx="23.756" cy="42.595" rx="5.351" ry="1.531" />
        <path d="M29.11 44.67v1.44c0 .63-2.4 1.14-5.35 1.14s-5.35-.51-5.35-1.14V44.67a13.156 13.156 0 0 0 5.35.96A13.21 13.21 0 0 0 29.11 44.67zM37.893 34.518c0 .027.007.052 0 .078l-.876 5.3c0 .012-.01.021-.012.033.545.112 1.108.216 1.678.31l.78-5.544C38.959 34.645 38.432 34.585 37.893 34.518zM33.408 33.792c-.306-.069-.6-.139-.856-.214-.3-.085-.58-.2-.864-.3l-1.28 4.206a.7.7 0 0 1-.08.162 16.433 16.433 0 0 0 1.932.936l1.13-4.746A.352.352 0 0 1 33.408 33.792zM23.13 24.54c-.82 1.35-1.34 2.2-1.54 2.48-.01.01-.01.02-.02.03C16.56 18.87 9.53 6.41 7.41 2.64A1.27 1.27 0 0 1 9.62 1.39C11.85 5.24 19.38 18.25 23.13 24.54zM30.34 32.66a.459.459 0 0 0-.07.14l-1.23 4.01a16.542 16.542 0 0 1-2.94-2.89c-.32-.38-.72-.94-1.2-1.64.51-.77 1.08-1.65 1.69-2.63A14.276 14.276 0 0 0 30.34 32.66zM36.425 34.326c-.538-.077-1.067-.16-1.573-.248a.682.682 0 0 1 0 .1L33.694 39.03a.614.614 0 0 1-.025.059c.56.175 1.193.35 1.878.517l.868-5.254C36.417 34.342 36.423 34.335 36.425 34.326zM42.532 34.988c-.4-.032-.948-.08-1.579-.139 0 .011 0 .021 0 .032L40.17 40.46c.571.073 1.139.131 1.7.175 0-.014 0-.026 0-.04zM47.238 37.576c-.1-1.526-1.769-2.105-3.218-2.4l-.659 5.53c.151 0 .3.007.45.007C46.586 40.715 47.36 39.371 47.238 37.576zM13.151 34.179a.682.682 0 0 1 0-.1c-.506.088-1.035.171-1.573.248 0 .009.008.016.01.026l.868 5.254c.685-.167 1.318-.342 1.878-.517a.614.614 0 0 1-.025-.059zM10.1 34.6c0-.026.005-.051 0-.078-.539.067-1.066.127-1.573.181l.78 5.544c.57-.094 1.133-.2 1.678-.31 0-.012-.01-.021-.012-.033zM7.047 34.849c-.631.059-1.178.107-1.579.139L6.137 40.6c0 .014 0 .026 0 .04.558-.044 1.126-.1 1.7-.175l-.785-5.579C7.043 34.87 7.048 34.86 7.047 34.849zM.762 37.576c-.122 1.8.652 3.139 3.427 3.141.147 0 .3 0 .45-.007L3.98 35.18C2.531 35.471.866 36.05.762 37.576z" />
        <path d="M40.094.907a1.274 1.274 0 0 0-1.715.479C35.536 6.3 24.079 26.1 22.821 27.884a15.575 15.575 0 0 1-5.158 4.778.738.738 0 0 1 .071.133l1.222 4.015A16.792 16.792 0 0 0 21.9 33.922c3.254-3.947 15.74-26.03 18.691-31.277A1.27 1.27 0 0 0 40.094.907zM16.312 33.274c-.284.109-.567.219-.864.3-.258.075-.55.145-.856.214a.352.352 0 0 1 .018.04l1.13 4.746a16.433 16.433 0 0 0 1.932-.936.7.7 0 0 1-.08-.162z" />
      </svg>
    ),
  },
  {
    label: 'Amerikan Futbolu',
    icon: (
      <svg width="20" height="20" viewBox="0 0 64 64" fill="#0E8FCF">
        <path d="M63.7 5.8C63.4 2.9 61.1.6 58.1.2c-1.6-.2-3.3-.3-5-.3-3.5 0-7 .4-10.4 1.2l-.2.1.1.2C46.5 9.9 53 16.3 62.5 21.3l.2.1.1-.3c1.2-5 1.5-10.3.9-15.3z" />
        <path d="m41 1.8-.1-.2h-.2c-10.8 3.1-20.6 10-29.1 20.6-.1.1-6.1 8.3-9.5 18.9l-.1.2.2.1c8.5 3.9 15.1 10.6 20.1 20.2l.1.2.2-.1c10.7-3.4 19-9.5 19-9.5 10.7-8.3 17.7-18.2 20.7-29V23l-.1-.1C52 17.7 45.1 10.8 41 1.8zm4.3 24.6c-.1.2-.4.2-.6.2-.2 0-.4-.1-.6-.2l-2.7-2.7-5.2 5.2 2.7 2.7c.3.3.3.8 0 1.2-.2.2-.4.2-.6.2-.2 0-.4-.1-.6-.2L35.1 30 30 35.2l2.7 2.7c.2.2.2.4.2.6 0 .2-.1.4-.2.6-.2.2-.4.2-.6.2-.2 0-.4-.1-.6-.2l-2.7-2.7-5.2 5.2 2.7 2.7c.2.2.2.4.2.6 0 .2-.1.4-.3.6-.1.2-.4.2-.6.2-.2 0-.4-.1-.6-.2l-2.7-2.7-1.3 1.3c-.2.2-.4.2-.6.2-.2 0-.4-.1-.6-.2-.3-.3-.3-.8 0-1.2l1.5-1.5-2.7-2.7c-.3-.3-.3-.8 0-1.2.2-.2.4-.2.6-.2.2 0 .4.1.6.2l2.7 2.7 5.2-5.2-2.7-2.5c-.3-.3-.3-.8 0-1.2.2-.2.4-.2.6-.2.2 0 .4.1.6.2l2.7 2.7 5.2-5.2-2.7-2.7c-.3-.3-.3-.8 0-1.2.2-.2.4-.2.6-.2.2 0 .4.1.6.2l2.7 2.7 5.2-5.2-2.7-2.7c-.2-.2-.2-.4-.2-.6 0-.2.1-.4.2-.6.2-.2.4-.2.6-.2.2 0 .4.1.6.2l2.7 2.7 1.5-1.5c.2-.2.4-.2.6-.2.2 0 .4.1.6.2.3.3.3.8 0 1.2l-1.5 1.5 2.7 2.7c0 .5 0 1-.3 1.3z" />
        <path d="m1.9 43.1-.3-.1-.1.2C0 48.6-.4 53.7.2 58.4c.4 2.7 2.5 4.9 5.3 5.3 1.4.2 2.8.3 4.3.3 3.4 0 7.1-.5 10.9-1.6l.2-.1-.1-.2c-4.8-9-11-15.2-18.9-19z" />
      </svg>
    ),
  },
  {
    label: 'Voleybol',
    icon: (
      <svg width="20" height="20" viewBox="0 0 512 512" fill="#0E8FCF">
        <path d="M256.07-0.047C114.467-0.047-0.326 114.746-0.326 256.349S114.467 512.744 256.07 512.744s256.395-114.792 256.395-256.395S397.673-0.047 256.07-0.047z M466.667 224v0.064c-19.353 12.05-40.515 20.917-62.677 26.261c-4.595-68.333-27.183-134.234-65.472-191.019C406.956 88.198 455.48 150.56 466.667 224z M256 42.667c5.397 0 10.667 0.405 15.979 0.811c53.223 58.444 84.842 133.342 89.6 212.245c-29.153 0.997-58.199-4.013-85.333-14.72c-4.247-72.136-38.705-139.14-94.912-184.555C205.188 47.391 230.484 42.722 256 42.667z M138.389 78.187c20.041 13.069 37.744 29.41 52.373 48.341C126.816 169.409 77.017 230.285 47.659 301.461C28.668 215.422 64.766 126.591 138.389 78.187z M71.595 362.773c21.296-81.459 71.492-152.392 141.227-199.573c12.627 25.943 19.835 54.187 21.184 83.008c-58.22 44.242-94.81 111.213-100.587 184.107C108.191 412.512 87.102 389.474 71.595 362.773z M256 469.333c-27.6-0.008-54.934-5.399-80.469-15.872c-0.47-27.519 4.398-54.867 14.336-80.533c70.121 31.128 147.992 40.413 223.467 26.645C373.07 443.969 315.934 469.303 256 469.333z M209.067 334.72c13.523-20.959 30.63-39.373 50.539-54.4c30.156 12.194 62.363 18.515 94.891 18.624c39.574-0.004 78.615-9.129 114.091-26.667c-1.999 26.074-8.82 51.551-20.117 75.136C369.697 371.777 284.821 367.277 209.067 334.72z" />
      </svg>
    ),
  },
  {
    label: 'Hentbol',
    icon: (
      <svg width="20" height="20" viewBox="0 0 48 48" fill="#0E8FCF">
        <path d="M38.851,25.78L27.536,14.465c-0.172-0.172-0.357-0.326-0.549-0.469C28.205,13.083,29,11.635,29,10c0-2.757-2.243-5-5-5s-5,2.243-5,5c0,1.128,0.385,2.162,1.018,3h-2.775l-1.599-1.599C16.478,10.507,17,9.317,17,8c0-2.757-2.243-5-5-5S7,5.243,7,8c0,0.696,0.145,1.359,0.403,1.962c-0.12,0.916,0.158,1.842,0.819,2.503l5.657,5.656C14.445,18.688,15.198,19,16,19h3v9c0,0.512,0.082,1.018,0.245,1.513L9.151,39.606c-1.17,1.17-1.17,3.073,0,4.243c1.17,1.17,3.073,1.17,4.243,0l10.855-10.855c0.15-0.007,0.291-0.044,0.437-0.065l2.435,2.435l-4.243,4.243c-1.17,1.17-1.17,3.073,0,4.243c1.17,1.17,3.073,1.17,4.243,0l6.364-6.364c1.169-1.17,1.169-3.073,0-4.243l-4.553-4.553C28.964,28.462,29,28.236,29,28v-3.586l5.608,5.608c1.17,1.17,3.073,1.17,4.243,0C40.02,28.853,40.021,26.949,38.851,25.78z M24,7c1.654,0,3,1.346,3,3s-1.346,3-3,3s-3-1.346-3-3S22.346,7,24,7z M12,5c1.654,0,3,1.346,3,3s-1.346,3-3,3S9,9.654,9,8S10.346,5,12,5z" />
      </svg>
    ),
  },
  {
    label: 'Beyzbol',
    icon: (
      <svg width="20" height="20" viewBox="0 0 100 100" fill="#0E8FCF">
        <path d="M22.917 966.945c-5.218 0-8.334 3.14-8.334 8.334 0 4.166 8.334 10.416 12.5 14.583 8.333 8.333 22.091 15.841 35.417 29.167l12.5 12.5-2.083 2.083c0 2.083 2.083 4.167 4.166 4.167l4.167-4.167 4.167-4.167c0-2.083-2.084-4.166-4.167-4.166l-2.083 2.083-12.5-12.5c-11.931-11.93-20.834-27.083-29.167-35.417-4.167-4.166-10.417-12.5-14.583-12.5zm14.583 41.667a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5z" transform="translate(0 -952.362)" />
      </svg>
    ),
  },
  {
    label: 'Masa Tenisi',
    icon: (
      <svg width="20" height="20" viewBox="0 0 48 48" fill="#0E8FCF">
        <path d="M43.89,27.24a4,4,0,1,0-.13,5.66A4,4,0,0,0,43.89,27.24Z" />
        <path d="M37.39 33.46a5 5 0 0 1 7-7.11 19 19 0 0 0 1.68-9.49A16 16 0 0 0 31 1.92c-5.85-.5-11.49 1.79-16.3 6.6a17.39 17.39 0 0 0-3.28 4.6L34.89 36.56a17.58 17.58 0 0 0 3.53-2.3A5 5 0 0 1 37.39 33.46zM32.9 37.4L10.62 15.12a17.65 17.65 0 0 0-.67 2.5L30.4 38.07A17.64 17.64 0 0 0 32.9 37.4zM9.65 20.15a17.43 17.43 0 0 0 1 6.8 3.92 3.92 0 0 1-.85 4.17L3.39 37.55a3.95 3.95 0 0 0 0 5.58l1.49 1.49a4 4 0 0 0 5.58 0l6.44-6.44a3.92 3.92 0 0 1 4.17-.85 17.42 17.42 0 0 0 6.8 1z" />
      </svg>
    ),
  },
  {
    label: 'Kriket',
    icon: (
      <svg width="20" height="20" viewBox="0 0 100 100" fill="#0E8FCF">
        <path d="M18.75 971.112c-4.167 4.167-4.167 8.333-4.167 8.333l41.667 41.667 6.25-2.083 16.667 16.666c1.318 1.318 2.109 2.084 3.776 2.084.52 0 1.172 0 1.823-.651.65-.652.65-1.302.65-1.823 0-1.667-.907-2.601-2.083-3.776l-16.666-16.667 2.083-6.25-41.667-41.667s-4.166 0-8.333 4.167zm14.583 37.5a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5z" transform="translate(0 -952.362)" />
      </svg>
    ),
  },
  {
    label: 'Plaj Voleybolu',
    icon: (
      <svg width="20" height="20" viewBox="0 0 512 512" fill="#0E8FCF">
        <path d="M256.07-0.047C114.467-0.047-0.326 114.746-0.326 256.349S114.467 512.744 256.07 512.744s256.395-114.792 256.395-256.395S397.673-0.047 256.07-0.047z M466.667 224v0.064c-19.353 12.05-40.515 20.917-62.677 26.261c-4.595-68.333-27.183-134.234-65.472-191.019C406.956 88.198 455.48 150.56 466.667 224z M256 42.667c5.397 0 10.667 0.405 15.979 0.811c53.223 58.444 84.842 133.342 89.6 212.245c-29.153 0.997-58.199-4.013-85.333-14.72c-4.247-72.136-38.705-139.14-94.912-184.555C205.188 47.391 230.484 42.722 256 42.667z M138.389 78.187c20.041 13.069 37.744 29.41 52.373 48.341C126.816 169.409 77.017 230.285 47.659 301.461C28.668 215.422 64.766 126.591 138.389 78.187z M71.595 362.773c21.296-81.459 71.492-152.392 141.227-199.573c12.627 25.943 19.835 54.187 21.184 83.008c-58.22 44.242-94.81 111.213-100.587 184.107C108.191 412.512 87.102 389.474 71.595 362.773z M256 469.333c-27.6-0.008-54.934-5.399-80.469-15.872c-0.47-27.519 4.398-54.867 14.336-80.533c70.121 31.128 147.992 40.413 223.467 26.645C373.07 443.969 315.934 469.303 256 469.333z M209.067 334.72c13.523-20.959 30.63-39.373 50.539-54.4c30.156 12.194 62.363 18.515 94.891 18.624c39.574-0.004 78.615-9.129 114.091-26.667c-1.999 26.074-8.82 51.551-20.117 75.136C369.697 371.777 284.821 367.277 209.067 334.72z" />
      </svg>
    ),
  },
  {
    label: 'Snooker',
    icon: (
      <svg width="20" height="20" viewBox="0 0 32 32" fill="#0E8FCF">
        <path d="M16 12C14.8907 12 14.1943 12.3565 13.824 12.9592C13.499 13.4883 13.4997 14.111 13.5 14.466L13.5 14.5C13.5 15.0062 13.6616 15.5332 14.1072 15.9254C14.1417 15.9557 14.1774 15.9848 14.2144 16.0127C14.0574 16.1406 13.9279 16.2902 13.8241 16.4592C13.4991 16.9883 13.4997 17.611 13.5001 17.966L13.5001 18C13.5001 18.5062 13.6617 19.0332 14.1073 19.4254C14.5436 19.8092 15.1801 20 16.0001 20C16.7933 20 17.424 19.8066 17.8636 19.4296C18.3114 19.0455 18.5001 18.5229 18.5001 18L18.5002 17.9525C18.5007 17.5388 18.5015 16.9084 18.1706 16.3943C18.0694 16.2371 17.9452 16.1003 17.7969 15.9841C17.8196 15.9664 17.8418 15.9482 17.8635 15.9296C18.3113 15.5455 18.5 15.0229 18.5 14.5L18.5001 14.4525C18.5006 14.0388 18.5014 13.4084 18.1705 12.8943C17.7901 12.3036 17.0846 12 16 12ZM16.0001 15.5C15.1717 15.5 14.7001 14.9404 14.7001 14.25C14.7001 13.5596 15.1717 13 16.0001 13C16.8285 13 17.3322 13.5596 17.3322 14.25C17.3322 14.9404 16.8285 15.5 16.0001 15.5ZM17.3323 17.75C17.3323 18.4404 16.8286 19 16.0002 19C15.1718 19 14.7002 18.4404 14.7002 17.75C14.7002 17.0596 15.1718 16.5 16.0002 16.5C16.8286 16.5 17.3323 17.0596 17.3323 17.75Z" />
        <path d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 23C12.134 23 9 19.866 9 16C9 12.134 12.134 9 16 9C19.866 9 23 12.134 23 16C23 19.866 19.866 23 16 23Z" />
      </svg>
    ),
  },
  {
    label: 'Futsal',
    icon: (
      <svg width="20" height="20" viewBox="0 0 64 64" fill="#0E8FCF">
        <path d="M31.39,62.97c-5.56-9.98-8.72-21.3-9.22-32.95-1.23-.11-2.43-.48-3.53-1.12-7.26,10.55-8.29,21.92-8.43,25.14,5.87,5.8,13.5,8.78,21.18,8.93Z" />
        <path d="M27.16 28.92c-.94.54-1.95.88-2.99 1.03.5 11.69 3.77 23.05 9.51 32.98 7.37-.39 14.63-3.4 20.25-9.02.63-.63 1.22-1.29 1.79-1.96-12.41-5.4-20-13.59-28.55-23.04zM14.66 6.31c.58 2.2 1.86 4.97 3.68 8 1.55-.99 3.35-1.42 5.13-1.31.79-4.69 3.12-9.18 4.67-11.74-4.74.59-9.37 2.27-13.48 5.05z" />
        <path d="M31.31 23.09c-.31 1.68-1.12 3.23-2.35 4.47-.06.06-.12.11-.19.17 8.45 9.34 15.98 17.41 28.22 22.61 3.83-5.21 5.81-11.35 5.97-17.53-6.91-4.14-18.51-8.67-31.65-9.72zM29.46 21.52c0-1.75-.68-3.39-1.92-4.63-1.28-1.28-2.95-1.91-4.63-1.91s-3.35.64-4.63 1.91c-1.24 1.24-1.92 2.88-1.92 4.63s.68 3.39 1.92 4.63c.2.2.42.39.64.56.01 0 .02 0 .03.02.01 0 .02.02.03.03 2.56 1.92 6.22 1.73 8.55-.6 1.24-1.24 1.92-2.88 1.92-4.63z" />
        <path d="M53.18 9.37c-2.9.25-13.11 1.58-22.8 7.99.63 1.14 1 2.41 1.06 3.73 12.85 1.03 24.29 5.3 31.51 9.39-.36-7.43-3.37-14.75-9.03-20.41-.24-.24-.49-.47-.74-.71zM14.39 21.89c0-.13-.02-.25-.02-.38 0-2.23.86-4.33 2.4-5.93-1.79-2.95-3.11-5.71-3.83-8.03-.99.77-1.95 1.61-2.87 2.52C5.6 14.56 2.79 20.08 1.63 25.86c4.01-1.81 8.29-3.14 12.76-3.97zM17.04 27.71c-.05-.05-.11-.1-.16-.15-1.04-1.04-1.78-2.31-2.17-3.69-4.74.89-9.26 2.36-13.45 4.38-1.01 8.33 1.35 16.99 7.08 23.76.43-4.83 2.13-14.78 8.7-24.3zM25.43 13.35c1.29.4 2.51 1.1 3.53 2.12.09.09.16.18.25.27 8.63-5.74 17.48-7.58 21.89-8.16C45.13 2.91 37.84.73 30.63 1.05c-1.25 1.92-4.33 7.06-5.2 12.31z" />
      </svg>
    ),
  },
]

// ── SVG icon lookup built from the filters array (skip Tümü at index 0) ──
const svgIconMap: Record<string, ReactNode> = Object.fromEntries(
  filters.slice(1).map(f => [f.label, f.icon])
)
// 'Buzhokeyi' in filters maps to 'Buz Hokeyi' in the popup list
svgIconMap['Buz Hokeyi'] = svgIconMap['Buzhokeyi']
svgIconMap['Su Topu']     = <img src="/icons/waterpolo_5.png" width={22} height={22} style={{ objectFit: 'contain' }} alt="Su Topu" />
svgIconMap['Badminton']   = <img src="/icons/shuttlecock.svg" width={22} height={22} style={{ objectFit: 'contain' }} alt="Badminton" />
svgIconMap['Dart']        = <img src="/icons/dart.svg"        width={22} height={22} style={{ objectFit: 'contain' }} alt="Dart" />
svgIconMap['Aussie Rules']  = <img src="/icons/AFL_5.png"          width={22} height={22} style={{ objectFit: 'contain' }} alt="Aussie Rules" />
svgIconMap['Rugby Birliği'] = <img src="/icons/rugbyUnion_5.png" width={22} height={22} style={{ objectFit: 'contain' }} alt="Rugby Birliği" />
svgIconMap['Lacrosse']      = <img src="/icons/lacrosse_5.png" width={22} height={22} style={{ objectFit: 'contain' }} alt="Lacrosse" />
svgIconMap['Boxing']        = <img src="/icons/boxing_5.png"  width={22} height={22} style={{ objectFit: 'contain' }} alt="Boxing" />
svgIconMap['Rugby Ligi']    = <img src="/icons/rugby_5.png"   width={22} height={22} style={{ objectFit: 'contain' }} alt="Rugby Ligi" />
svgIconMap['Çim Hokeyi']    = <img src="/icons/hockey.svg"    width={22} height={22} style={{ objectFit: 'contain' }} alt="Çim Hokeyi" />
svgIconMap['MMA']           = <img src="/icons/MMA_5.png"     width={22} height={22} style={{ objectFit: 'contain' }} alt="MMA" />
svgIconMap['Squash']        = <img src="/icons/squash_5.png"          width={22} height={22} style={{ objectFit: 'contain' }} alt="Squash" />
svgIconMap['Gal Futbolu']   = <img src="/icons/gaelicFootball_5.png" width={22} height={22} style={{ objectFit: 'contain' }} alt="Gal Futbolu" />
svgIconMap['Florbol']       = <img src="/icons/floorball_5.png"  width={22} height={22} style={{ objectFit: 'contain' }} alt="Florbol" />
svgIconMap['İrlanda Hokeyi']= <img src="/icons/hurling_5.png"       width={22} height={22} style={{ objectFit: 'contain' }} alt="İrlanda Hokeyi" />
svgIconMap['Sanal Futbol']      = <img src="/icons/vrtrdrSoccer_5.png"      width={22} height={22} style={{ objectFit: 'contain' }} alt="Sanal Futbol" />
svgIconMap['Sanal Basketbol']   = <img src="/icons/vrtrdrBasketball_5.png" width={22} height={22} style={{ objectFit: 'contain' }} alt="Sanal Basketbol" />
svgIconMap['Sanal Tenis']       = <img src="/icons/vrtrdrTennis_5.png"    width={22} height={22} style={{ objectFit: 'contain' }} alt="Sanal Tenis" />
svgIconMap['Sanal Beyzbol']       = <img src="/icons/vrtrdrBaseball_5.png"    width={22} height={22} style={{ objectFit: 'contain' }} alt="Sanal Beyzbol" />
svgIconMap['Sanal Köpek Yarışı']  = <img src="/icons/vrtrdrGreyhounds_5.png"   width={22} height={22} style={{ objectFit: 'contain' }} alt="Sanal Köpek Yarışı" />
svgIconMap['Virtual HorseRacing'] = <img src="/icons/vrtrdrHorseRacing_5.png" width={22} height={22} style={{ objectFit: 'contain' }} alt="Virtual HorseRacing" />
svgIconMap['Dota 2']              = <img src="/icons/dota2_5.png"          width={22} height={22} style={{ objectFit: 'contain' }} alt="Dota 2" />
svgIconMap['Call of Duty']        = <img src="/icons/callOfDuty_5.png"    width={22} height={22} style={{ objectFit: 'contain' }} alt="Call of Duty" />
svgIconMap['King Of Glory']       = <img src="/icons/kingOfGlory_5.png" width={22} height={22} style={{ objectFit: 'contain' }} alt="King Of Glory" />
svgIconMap['League of Legends']   = <img src="/icons/LOL_5.png"             width={22} height={22} style={{ objectFit: 'contain' }} alt="League of Legends" />
svgIconMap['Rainbow Six']         = <img src="/icons/rainbowSix_5.png" width={22} height={22} style={{ objectFit: 'contain' }} alt="Rainbow Six" />
svgIconMap['Counter-Strike']      = <img src="/icons/CS2_5.png"        width={22} height={22} style={{ objectFit: 'contain' }} alt="Counter-Strike" />
svgIconMap['e-Dövüş']             = <img src="/icons/eFighting_5.png" width={22} height={22} style={{ objectFit: 'contain' }} alt="e-Dövüş" />
svgIconMap['e-Tenis']             = <img src="/icons/eTennis_5.png"          width={22} height={22} style={{ objectFit: 'contain' }} alt="e-Tenis" />
svgIconMap['Mobile Legends']      = <img src="/icons/mobileLegends_5.png" width={22} height={22} style={{ objectFit: 'contain' }} alt="Mobile Legends" />
svgIconMap['Valorant']            = <img src="/icons/valorant_5.png"       width={22} height={22} style={{ objectFit: 'contain' }} alt="Valorant" />

// ── Full sport list for filter modal ──────────────────────────
type SportItem = { label: string; emoji: string; icon?: ReactNode }
const allSports: SportItem[] = [
  { label: 'Futbol',               emoji: '⚽' },
  { label: 'Basketbol',            emoji: '🏀' },
  { label: 'Sanal Futbol',         emoji: '🎮' },
  { label: 'Sanal Basketbol',      emoji: '🎮' },
  { label: 'Tenis',                emoji: '🎾' },
  { label: 'Sanal Tenis',          emoji: '🎮' },
  { label: 'Buz Hokeyi',           emoji: '🏒' },
  { label: 'Hentbol',              emoji: '🤾' },
  { label: 'Çim Hokeyi',           emoji: '🏑' },
  { label: 'Amerikan Futbolu',     emoji: '🏈' },
  { label: 'Beyzbol',              emoji: '⚾' },
  { label: 'Sanal Beyzbol',        emoji: '🎮' },
  { label: 'Voleybol',             emoji: '🏐' },
  { label: 'Badminton',            emoji: '🏸' },
  { label: 'Dota 2',               emoji: '🖥️' },
  { label: 'Kriket',               emoji: '🏏' },
  { label: 'Su Topu',              emoji: '🤽' },
  { label: 'Masa Tenisi',          emoji: '🏓' },
  { label: 'Futsal',               emoji: '⚽' },
  { label: 'Dart',                 emoji: '🎯' },
  { label: 'Aussie Rules',         emoji: '🏉' },
  { label: 'Snooker',              emoji: '🎱' },
  { label: 'Rugby Birliği',        emoji: '🏉' },
  { label: 'Rugby Ligi',           emoji: '🏉' },
  { label: 'Florbol',              emoji: '🏑' },
  { label: 'Sanal Köpek Yarışı',   emoji: '🐕' },
  { label: 'Virtual HorseRacing',  emoji: '🐎' },
  { label: 'Call of Duty',         emoji: '🖥️' },
  { label: 'Gal Futbolu',          emoji: '⚽' },
  { label: 'İrlanda Hokeyi',       emoji: '🏑' },
  { label: 'King Of Glory',        emoji: '🖥️' },
  { label: 'Lacrosse',             emoji: '🥍' },
  { label: 'League of Legends',    emoji: '🖥️' },
  { label: 'Rainbow Six',          emoji: '🖥️' },
  { label: 'Squash',               emoji: '🎾' },
  { label: 'Boxing',               emoji: '🥊' },
  { label: 'Counter-Strike',       emoji: '🖥️' },
  { label: 'e-Dövüş',              emoji: '🖥️' },
  { label: 'e-Tenis',              emoji: '🖥️' },
  { label: 'MMA',                  emoji: '🥋' },
  { label: 'Mobile Legends',       emoji: '🖥️' },
  { label: 'Valorant',             emoji: '🖥️' },
].map(s => ({ ...s, icon: svgIconMap[s.label] }))

// Group by category
const categories = [
  {
    label: 'Spor',
    items: allSports.filter(s =>
      !s.label.startsWith('Sanal') && !s.label.startsWith('Virtual') &&
      !['Dota 2','Call of Duty','King Of Glory','League of Legends','Rainbow Six',
        'Counter-Strike','e-Dövüş','e-Tenis','Mobile Legends','Valorant'].includes(s.label)
    ),
  },
  {
    label: 'Sanal Spor',
    items: allSports.filter(s => s.label.startsWith('Sanal') || s.label.startsWith('Virtual')),
  },
  {
    label: 'E-Spor',
    items: allSports.filter(s =>
      ['Dota 2','Call of Duty','King Of Glory','League of Legends','Rainbow Six',
        'Counter-Strike','e-Dövüş','e-Tenis','Mobile Legends','Valorant'].includes(s.label)
    ),
  },
]

export default function QuickFilters() {
  const [active, setActive]     = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch]     = useState('')

  function toggleSport(label: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })
  }

  function toggleAll(items: typeof allSports) {
    const allSelected = items.every(s => selected.has(s.label))
    setSelected(prev => {
      const next = new Set(prev)
      items.forEach(s => allSelected ? next.delete(s.label) : next.add(s.label))
      return next
    })
  }

  const filtered = search.trim()
    ? allSports.filter(s => s.label.toLowerCase().includes(search.toLowerCase()))
    : null

  return (
    <>
      {/* ── Quick-bar ── */}
      <div className="flex gap-[5px]">
        {filters.slice(0, 5).map((f, i) => (
          <button
            key={f.label}
            onClick={() => setActive(i)}
            className={`flex flex-col items-center justify-center gap-[5px] flex-1 min-h-[60px] py-[6px] rounded-[10px] transition-all ${
              active === i ? 'bg-[#0E8FCF]' : 'bg-white'
            }`}
          >
            <div className={active === i ? '[&_svg]:brightness-0 [&_svg]:invert' : ''}>
              {f.icon}
            </div>
            <span className={`text-[9px] font-medium text-center leading-tight w-full px-[4px] break-words ${
              active === i ? 'text-white' : 'text-[#1a2332]'
            }`}>
              {f.label}
            </span>
          </button>
        ))}

        {/* Filter trigger button */}
        <button
          onClick={() => setModalOpen(true)}
          className={`flex flex-col items-center justify-center gap-[5px] flex-1 min-h-[60px] py-[6px] rounded-[10px] transition-all relative ${
            selected.size > 0 ? 'bg-[#0E8FCF]' : 'bg-white'
          }`}
        >
          {selected.size > 0 && (
            <span className="absolute top-[5px] right-[5px] w-[14px] h-[14px] rounded-full bg-[#ef4444] text-white text-[8px] font-bold flex items-center justify-center leading-none">
              {selected.size}
            </span>
          )}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke={selected.size > 0 ? '#fff' : '#737B8C'} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          <span className={`text-[9px] font-medium ${selected.size > 0 ? 'text-white' : 'text-[#737B8C]'}`}>
            Filtre
          </span>
        </button>
      </div>

      {/* ── Modal overlay ── */}
      <div
        className={`fixed inset-0 z-[70] transition-all duration-300 ${modalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
        onClick={() => setModalOpen(false)}
      />

      {/* ── Bottom sheet ── */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[80] transition-transform duration-350 ${modalOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ borderRadius: '20px 20px 0 0', background: '#fff', maxHeight: '82vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-[10px] pb-[4px] flex-shrink-0">
          <div className="w-[36px] h-[4px] rounded-full bg-[#e2e8f0]"/>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-[16px] py-[12px] border-b border-[#f0f2f5] flex-shrink-0">
          <div>
            <h3 className="text-[15px] font-extrabold text-[#1a2332]">Spor Filtresi</h3>
            <p className="text-[10px] text-[#94a3b8] mt-[1px]">{allSports.length} spor mevcut</p>
          </div>
          <div className="flex items-center gap-[8px]">
            {selected.size > 0 && (
              <button
                onClick={() => setSelected(new Set())}
                className="text-[10px] font-semibold text-[#ef4444] px-[10px] py-[5px] rounded-full border border-[#fecaca]"
              >
                Temizle
              </button>
            )}
            <button
              onClick={() => setModalOpen(false)}
              className="w-[30px] h-[30px] rounded-full bg-[#f1f5f9] flex items-center justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-[16px] py-[10px] flex-shrink-0">
          <div className="flex items-center gap-[8px] bg-[#f1f5f9] rounded-xl px-[12px] py-[8px]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Spor ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[12px] text-[#1a2332] placeholder-[#94a3b8] outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Sport list */}
        <div className="flex-1 overflow-y-auto px-[16px] pb-[100px]">
          {filtered ? (
            <div className="grid grid-cols-3 gap-[8px] pt-[4px]">
              {filtered.map(s => {
                const sel = selected.has(s.label)
                return (
                  <SportCard key={s.label} sport={s} selected={sel} onToggle={() => toggleSport(s.label)} />
                )
              })}
              {filtered.length === 0 && (
                <p className="col-span-3 text-center text-[12px] text-[#94a3b8] py-[24px]">Sonuç bulunamadı.</p>
              )}
            </div>
          ) : (
            categories.map(cat => (
              <div key={cat.label} className="mb-[18px]">
                <div className="flex items-center justify-between mb-[8px]">
                  <span className="text-[11px] font-bold text-[#0E8FCF] uppercase tracking-wider">{cat.label}</span>
                  <button
                    onClick={() => toggleAll(cat.items)}
                    className="text-[9px] font-semibold text-[#64748b] px-[8px] py-[3px] rounded-full bg-[#f1f5f9]"
                  >
                    {cat.items.every(s => selected.has(s.label)) ? 'Kaldır' : 'Tümünü Seç'}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-[8px]">
                  {cat.items.map(s => {
                    const sel = selected.has(s.label)
                    return (
                      <SportCard key={s.label} sport={s} selected={sel} onToggle={() => toggleSport(s.label)} />
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Apply button */}
        <div className="absolute bottom-0 left-0 right-0 px-[16px] py-[14px] bg-white border-t border-[#f0f2f5]"
          style={{ boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' }}>
          <button
            onClick={() => setModalOpen(false)}
            className="w-full py-[13px] rounded-[14px] text-[13px] font-bold text-white transition-all"
            style={{ background: 'linear-gradient(135deg,#0c3060,#0E8FCF)' }}
          >
            {selected.size > 0 ? `${selected.size} Filtre Uygula` : 'Tümünü Göster'}
          </button>
        </div>
      </div>
    </>
  )
}

function SportCard({ sport, selected, onToggle }: {
  sport: SportItem
  selected: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="relative flex flex-col items-center justify-center gap-[5px] rounded-[12px] py-[10px] px-[4px] transition-all"
      style={{
        background: selected ? 'rgba(14,143,207,0.08)' : '#f8fafc',
        border: selected ? '1.5px solid #0E8FCF' : '1.5px solid #e8ecf1',
      }}
    >
      {selected && (
        <span className="absolute top-[5px] right-[5px] w-[12px] h-[12px] rounded-full bg-[#0E8FCF] flex items-center justify-center">
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </span>
      )}
      {sport.icon
        ? <div className="w-[22px] h-[22px] flex items-center justify-center">{sport.icon}</div>
        : <span className="text-[20px] leading-none">{sport.emoji}</span>
      }
      <span className={`text-[9px] font-semibold text-center leading-tight px-[2px] line-clamp-2 ${selected ? 'text-[#0E8FCF]' : 'text-[#374957]'}`}>
        {sport.label}
      </span>
    </button>
  )
}
