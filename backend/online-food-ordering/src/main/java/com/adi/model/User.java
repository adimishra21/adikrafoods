package com.adi.model;

import com.adi.dto.RestaurantDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
 
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Id
	private Long id;
	
	private String fullname;
	
	private String email;
	
	private String password;
	
	private USER_ROLE role = USER_ROLE.ROLE_CUSTOMER;

	@JsonIgnore
	@OneToMany(cascade = CascadeType.ALL,mappedBy = "customer")
	private List<Order> orders = new ArrayList<>();

	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "user_favorites", joinColumns = @JoinColumn(name = "user_id"))
	private List<RestaurantDto> favorites = new ArrayList<>();

	@OneToMany(cascade = CascadeType.ALL)
	private List<Address> addresses = new ArrayList<>();

	@ManyToMany
	@JoinTable(
		name = "user_favorite_restaurants",
		joinColumns = @JoinColumn(name = "user_id"),
		inverseJoinColumns = @JoinColumn(name = "restaurant_id")
	)
	@JsonIgnore
	private Set<Restaurant> favoriteRestaurants = new HashSet<>();

	public Set<Restaurant> getFavoriteRestaurants() {
		return favoriteRestaurants;
	}
	
	public void setFavoriteRestaurants(Set<Restaurant> favoriteRestaurants) {
		this.favoriteRestaurants = favoriteRestaurants;
	}
}
