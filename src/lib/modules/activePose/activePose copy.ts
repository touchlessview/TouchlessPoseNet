// import { defaultActivePoseConfig, ActivePoseFilters, ActivePosesConfig } from './config';
// import { Pose } from '@tensorflow-models/posenet';
// import { StreamModule } from '../streamModule';

// export class ActivePose extends StreamModule {

//   config: ActivePosesConfig;
//   // filters: ActivePoseFilters
//   // filter: (poses: Pose[]) => Pose[];
//   getIndexes: (poses: Pose[]) => number[];

//   constructor(config?: ActivePosesConfig) {
//     super()
//     this.config = { ...defaultActivePoseConfig, ...config }
//     this.getIndexes = this._getIndexes;
//     // this.filters = {
//     //   before: (poses: Pose[], config: ActivePosesConfig): Pose[] => poses,
//     //   main: this.mainFilter,
//     //   after: (poses: Pose[], config: ActivePosesConfig): Pose[] => poses,
//     // }
    
//   }

//   public setConfig(config?: ActivePosesConfig): void {
//     this.config = { ...this.config, ...config }
//   }

//   // public setFilters(filters: ActivePoseFilters) {
//   //   this.filters = { ...this.filters, ...filters }
//   // }

//   public async create() {
//     // this.filter = (poses: Pose[]): Pose[] => this.filters.after(
//     //   this.filters.main(
//     //     this.filters.before(poses, this.config),
//     //     this.config),
//     //   this.config);
//   }

//   private _getIndexes(poses: Pose[]): number[] {
//     return [1]
//   }
// }
