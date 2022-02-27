import NotFoundException from 'App/Exceptions/NotFoundException'
import Project from 'App/Models/Project'

class ProjectQuery {
  public async findById(projectId: number) {
    return await Project.find(projectId)
  }

  public async findByIdOrFail(projectId: number) {
    const project = await this.findById(projectId)

    if (!project) {
      throw new NotFoundException()
    }

    return project
  }
}

export default new ProjectQuery()
