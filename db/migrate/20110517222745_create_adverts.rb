class CreateAdverts < ActiveRecord::Migration
  def self.up
    create_table :adverts do |t|
      t.integer :x_position
      t.integer :y_position
      t.string :text
      t.string :url
      t.boolean :paid

      t.timestamps
    end
  end

  def self.down
    drop_table :adverts
  end
end
