class Advert < ActiveRecord::Base
  attr_accessible :image, :url, :x_position, :y_position, :text
  has_attached_file :image, :url => "/adverts/:id/:style/:basename.:extension",  
    :path => ":rails_root/public/adverts/:id/:style/:basename.:extension"  

  validates_presence_of :text, :url, :image
  
  def validate
    if self.image.queued_for_write[:original]
      image_dimensions = Paperclip::Geometry.from_file(self.image.queued_for_write[:original])
      if (image_dimensions.width % 10) != 0
        self.errors.add(:image, "Please ensure your advert's width is a multiple of 10")
      end
      
      if (image_dimensions.height % 10) != 0
        self.errors.add(:image, "Please ensure your advert's height is a multiple of 10")
      end
    end
  end
  
  def before_initialize
    self.paid = false
  end
  
  def pay
    self.paid = true
    self.save
  end
end
