class AdvertsController < ApplicationController
  # GET /adverts
  # GET /adverts.xml
  def index
    @adverts = Advert.find_all_by_paid(true)

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @adverts }
    end
  end


  # GET /adverts/new
  # GET /adverts/new.xml
  def new
    @advert = Advert.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @advert }
    end
  end

  # POST /adverts
  # POST /adverts.xml
  def create
    @advert = Advert.new(params[:advert])

    respond_to do |format|
      if @advert.save
        format.html { redirect_to(position_advert_path(@advert), :notice => 'Advert was successfully created.') }
        format.xml  { render :xml => @advert, :status => :created, :location => @advert }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @advert.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  def position
    @advert = Advert.find_by_id(params[:id])
    @adverts = Advert.find_all_by_paid(true)
  end
  
  def payment
    @advert = Advert.find_by_id(params[:id])
    @adverts = Advert.find_all_by_paid(true)
    @adverts << @advert
  end
  
  def pay
    @advert = Advert.find_by_id(params[:id])
    @advert.pay
    respond_to do |format|
      format.html { redirect_to(adverts_path) }
    end
    
  end

  # PUT /adverts/1
  # PUT /adverts/1.xml
  def update
    @advert = Advert.find(params[:id])

    respond_to do |format|
      if @advert.update_attributes(params[:advert])
        if params["advert"]["x_position"] && params["advert"]["y_position"]
          format.html { redirect_to(payment_advert_path(@advert)) }
        else
          format.html { redirect_to(@advert, :notice => 'Advert was successfully updated.') }
          format.xml  { head :ok }
        end
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @advert.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /adverts/1
  # DELETE /adverts/1.xml
  def destroy
    @advert = Advert.find(params[:id])
    @advert.destroy

    respond_to do |format|
      format.html { redirect_to(adverts_url) }
      format.xml  { head :ok }
    end
  end
end
