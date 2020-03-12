import {request} from './request'

export function getDetali(iid) {
  return request({
    url: '/detail',
    params: {
      iid
    }
  })
}

export function getRecommendData(iid) {
  return request({
    url: '/recommend'
  })
}

// 创建一个类并导出
export class Goods {
  constructor(itemInfo, columns, services) {
    this.title = itemInfo.title
    this.desc = itemInfo.desc
    this.newPrice = itemInfo.price
    this.oldPrice = itemInfo.oldPrice
    this.discount = itemInfo.discountDesc
    this.realPrice = itemInfo.lowNowPrice
    this.columns = columns
    this.services = services
  }
}

export class GoodsParam {
  constructor(info, rule) {
    // 注: images可能没有值（某些商品有值，某些没有）
    this.image = info.iages ? info.iages[0] : ''
    this.infos = info.set
    this.sizes = rule.tables
  }
}

export class Shop {
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo
    this.name = shopInfo.name
    this.fans = shopInfo.cFans
    this.sells = shopInfo.cSells
    this.score = shopInfo.score
    this.goodsCount = shopInfo.cGoods
  }
}