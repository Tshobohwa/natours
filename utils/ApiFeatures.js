class APIFeatures {
  constructor(query, queryStr) {
    this.query = query
    this.queryStr = queryStr
  }

  filter() {
    const queryObj = { ...this.queryStr }
    const excludeFileds = ['page', 'limit', 'sort', 'fields']
    excludeFileds.forEach((el) => delete queryObj[el])

    // 2) Advanced filtering
    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace(
      /\b(lt|lte|gt|gte)\b/g,
      (match) => `$${match}`,
    )

    this.query.find(JSON.parse(queryString))

    return this
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt')
    }
    return this
  }

  limiting() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }
    return this
  }

  paginate() {
    const page = +this.queryStr.page || 1
    const limit = +this.queryStr.limit || 100
    const skip = (page - 1) * limit
    console.log(page, limit)

    this.query = this.query.skip(skip).limit(limit)

    return this
  }
}

module.exports = APIFeatures
