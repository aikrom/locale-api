import NotFoundException from 'App/Exceptions/NotFoundException'
import Project from 'App/Models/Project'

class ProjectQuery {
  /**
   * Find project by `ID`
   *
   * @param projectId - Project ID
   */
  public async findById(projectId: number) {
    return await Project.find(projectId)
  }

  /**
   * Find project by `ID` and fail if not found
   *
   * @param projectId - Project ID
   */
  public async findByIdOrFail(projectId: number) {
    const project = await this.findById(projectId)

    if (!project) {
      throw new NotFoundException()
    }

    return project
  }
}

export default new ProjectQuery()
