// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: IEnvironment = {
  production: false,
  sitePath: (window as { [key: string]: any })['env']['sitePath'] || '',
  karmYogiPath: (window as { [key: string]: any })['env']['karmYogiPath'] || '',
  portalRoles: (((window as { [key: string]: any })['env']['portalRoles'] || '').split(',')) || [],
  name: (window as { [key: string]: any })['env']['name'],
  cbpProviderRoles: (window as { [key: string]: any })['env']['cbpProvidersRoles'] || [],
  userBucket: (window as { [key: string]: any })['env']['userBucket'] || '',
  departments: (window as { [key: string]: any })['env']['departments'] || [],
  contentHost: (window as { [key: string]: any })['env']['contentHost'] || '',
  contentBucket: (window as { [key: string]: any })['env']['azureBucket'] || '',
  spvPath: (window as { [key: string]: any })['env']['spvPath'] || '',
  connectionType: (window as { [key: string]: any })['env']['connectionType'] || '',
  KCMframeworkName: (window as { [key: string]: any })['env']['KCMframeworkName'] || '',
}
interface IEnvironment {
  contentBucket: any
  contentHost: any
  name: string,
  production: boolean
  sitePath: null | string
  karmYogiPath: string
  portalRoles: string[]
  cbpProviderRoles: string[]
  userBucket?: string
  departments?: string[]
  spvPath?: string
  connectionType?: string,
  KCMframeworkName?: string
}

/*
 * For easier debugging in development mode, you can import the    file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error' // Included with Angular CLI.x
